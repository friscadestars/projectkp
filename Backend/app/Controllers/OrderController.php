<?php

namespace App\Controllers;

use App\Models\OrderModel;
use App\Models\OrderItemModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\Database\Exceptions\DatabaseException;
use App\Models\UserModel;
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;
use App\Models\RiwayatOrderModel;
use App\Models\InvoiceModel;
use App\Models\ProductPriceModel;
use App\Models\NotificationModel;
use CodeIgniter\I18n\Time;

class OrderController extends ResourceController
{
    protected $modelName = OrderModel::class;
    protected $format    = 'json';

    protected $orderItemModel;

    public function __construct()
    {
        $this->orderItemModel = new OrderItemModel();
    }

    public function index()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $this->failUnauthorized('Token tidak ditemukan.');
        }

        $token = $matches[1];
        $secretKey = getenv('JWT_SECRET') ?: 'default_key';

        try {
            $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
            $userId = $decoded->data->id;
            $userRole = $decoded->data->role;
        } catch (\Exception $e) {
            return $this->failUnauthorized('Token tidak valid');
        }

        $builder = $this->model->orderBy('id', 'DESC');

        if ($userRole === 'agen') {
            $builder->where('agen_id', $userId);
        } elseif ($userRole === 'distributor') {
            $builder->where('distributor_id', $userId);
        } elseif ($userRole === 'pabrik') {
            $builder->where('pabrik_id', $userId);
        }

        $orders = $builder->findAll();

        if (!$orders) {
            return $this->respond([]);
        }

        $orderIds = array_column($orders, 'id');
        $items = $this->orderItemModel
            ->whereIn('order_id', $orderIds)
            ->findAll();

        $grouped = [];
        foreach ($items as $item) {
            $grouped[$item['order_id']][] = $item;
        }

        $userIds = [];
        foreach ($orders as $order) {
            if (!empty($order['agen_id'])) $userIds[] = (int) $order['agen_id'];
            if (!empty($order['distributor_id'])) $userIds[] = (int) $order['distributor_id'];
            if (!empty($order['pabrik_id'])) $userIds[] = (int) $order['pabrik_id'];
        }

        $userMap = [];
        if (!empty($userIds)) {
            $userModel = new UserModel();
            $users = $userModel->whereIn('id', array_unique($userIds))->findAll();
            foreach ($users as $u) {
                $userMap[(int) $u['id']] = $u['name'];
            }
        }

        foreach ($orders as &$order) {
            $order['items'] = $grouped[$order['id']] ?? [];

            $order['agen'] = $userMap[(int) $order['agen_id']] ?? 'Nama tidak ditemukan';
            $order['distributor'] = $userMap[(int) $order['distributor_id']] ?? 'Nama tidak ditemukan';
            $order['pabrik_name'] = $userMap[(int) $order['pabrik_id']] ?? 'Pabrik tidak dikenal';

            $order['order_code'] = $order['order_code'] ?? sprintf('ord-%03d', $order['agent_order_no'] ?? 0);
            $order['agen_id'] = $order['agen_id'] ?? null;
            $order['distributor_id'] = $order['distributor_id'] ?? null;
        }

        $orderIds = array_column($orders, 'id');

        $invoiceModel = new \App\Models\InvoiceModel();
        $invoices = $invoiceModel
            ->whereIn('order_id', $orderIds)
            ->where('pabrik_id', null)
            ->where('agen_id !=', null)
            ->where('distributor_id !=', null)
            ->findAll();

        $invoiceMap = [];
        foreach ($invoices as $inv) {
            if (!empty($inv['agen_id']) && !empty($inv['distributor_id']) && empty($inv['pabrik_id'])) {
                $invoiceMap[$inv['order_id']] = [
                    'id'     => $inv['id'],
                    'status' => strtolower($inv['status']),
                ];
            }
        }

        foreach ($orders as &$order) {
            unset($order['invoiceExist'], $order['invoiceId'], $order['statusPembayaran']);

            $order['invoiceId'] = null;
            $order['statusPembayaran'] = null;
            $order['invoiceExist'] = false;

            $invoice = $invoiceMap[$order['id']] ?? null;

            if ($invoice && !empty($invoice['id'])) {
                $order['invoiceId'] = $invoice['id'];
                $order['statusPembayaran'] = $invoice['status'];
                $order['invoiceExist'] = true;
            }
        }
        return $this->respond($orders);
    }

    public function create()
    {
        $payload = $this->request->getJSON(true);
        if (!$payload) {
            return $this->failValidationErrors('Payload tidak valid / kosong');
        }

        $rules = [
            'agen_id'    => 'required|integer',
            'status'     => 'required|in_list[pending,processing, produced, shipped,delivered,cancelled,approved]',
            'order_date' => 'required|valid_date[Y-m-d H:i:s]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $alamat   = $payload['alamat'] ?? $payload['note'] ?? null;
        $products = $payload['products'] ?? [];
        $nextNo = $this->model
            ->where('agen_id', (int) $payload['agen_id'])
            ->countAllResults() + 1;

        $orderCode = sprintf('ord-%03d', $nextNo);

        $orderData = [
            'agen_id'        => (int) ($payload['agen_id'] ?? 0),
            'distributor_id' => isset($payload['distributor_id']) ? (int) $payload['distributor_id'] : null,
            'pabrik_id'      => $payload['pabrik_id'] ?? null,
            'status'         => $payload['status'],
            'order_date'     => Time::parse($payload['order_date'], 'UTC')->setTimezone('Asia/Jakarta')->toDateTimeString(),
            'delivery_date'  => isset($payload['delivery_date']) ? Time::parse($payload['delivery_date'], 'UTC')->setTimezone('Asia/Jakarta')->toDateTimeString() : null,
            'resi'           => $payload['resi'] ?? null,
            'accepted_at'    => isset($payload['accepted_at']) ? Time::parse($payload['accepted_at'], 'UTC')->setTimezone('Asia/Jakarta')->toDateTimeString() : null,
            'note'           => $alamat,
            'agent_order_no' => $nextNo,
            'order_code'     => $orderCode,
        ];

        $db = \Config\Database::connect();
        $db->transBegin();

        try {
            log_message('debug', 'ORDER PAYLOAD: ' . json_encode($orderData));
            $orderId = $this->model->insert($orderData, true);
            if (!$orderId) {
                throw new DatabaseException('Gagal menyimpan order');
            }

            foreach ($products as $p) {
                $this->orderItemModel->insert([
                    'order_id'     => $orderId,
                    'kode_produk'  => $p['kode_produk'] ?? $p['kode'] ?? null,
                    'product_name' => $p['nama']        ?? $p['product_name'] ?? '',
                    'quantity'     => $p['jumlah']      ?? $p['quantity']     ?? 0,
                    'unit_price'   => $p['harga']       ?? $p['unit_price']   ?? 0,
                    'address'      => $alamat ?? '',
                ]);
            }

            if ($db->transStatus() === false) {
                throw new DatabaseException('Transaksi gagal');
            }

            $db->transCommit();

            $order = $this->model->find($orderId);
            $order['items'] = $this->orderItemModel->where('order_id', $orderId)->findAll();

            $userModel = new UserModel();
            $agen = $userModel->find($order['agen_id']);
            $distributor = $userModel->find($order['distributor_id']);

            $order['agen'] = $agen['name'] ?? 'Agen tidak dikenal';
            $order['distributor'] = $distributor['name'] ?? 'Distributor tidak dikenal';
            $order['agen_id'] = $order['agen_id'];
            $order['distributor_id'] = $order['distributor_id'];
            // unset($order['agen_id'], $order['distributor_id']);

            $notifModel = new NotificationModel();

            if (!empty($order['distributor_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['distributor_id'],
                    'title'      => 'Pesanan Baru Masuk, Ayo Lihat Pesananmu!',
                    'message'    => ($agen['name'] ?? 'Agen tidak dikenal') . ' telah membuat pesanan baru.',
                    'type'       => 'order_created',
                    'is_read'    => 0,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }

            if (!empty($order['agen_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['agen_id'],
                    'title'      => 'Pesanan Berhasil Dikirim',
                    'message'    => 'Selamat! Pesanan Anda berhasil dikirim ke distributor.',
                    'type'       => 'order_sent',
                    'is_read'    => 0,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }

            if (!empty($order['pabrik_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['pabrik_id'],
                    'title'      => 'Permintaan Order Baru',
                    'message'    => 'Pesanan baru dari distributor! Ayo Lihat.',
                    'type'       => 'order_created_to_factory',
                    'is_read'    => 0,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }

            return $this->respondCreated([
                'message' => 'Order berhasil dibuat',
                'data'    => $order
            ]);
        } catch (\Throwable $e) {
            $db->transRollback();
            return $this->failServerError($e->getMessage());
        }

        $productPriceModel = new ProductPriceModel();

        foreach ($products as $p) {
            $harga = $p['harga'] ?? $p['unit_price'] ?? 0;

            if (isset($orderData['pabrik_id'])) {
                $kodeProduk = $p['kode'] ?? $p['kode_produk'] ?? null;

                if ($kodeProduk) {
                    $hargaData = $productPriceModel
                        ->where('kode_produk', $kodeProduk)
                        ->where('role', 'pabrik')
                        ->orderBy('created_at', 'desc')
                        ->first();

                    if ($hargaData) {
                        $harga = $hargaData['harga'];
                    }
                }
            }

            $this->orderItemModel->insert([
                'order_id'     => $orderId,
                'kode_produk'  => $p['kode_produk'] ?? $p['kode'] ?? null,
                'product_name' => $p['nama']        ?? $p['product_name'] ?? '',
                'quantity'     => $p['jumlah']      ?? $p['quantity']     ?? 0,
                'unit_price'   => $harga,
                'address'      => $alamat ?? '',
            ]);
        }
    }

    public function show($idOrCode = null)
    {
        if (!$idOrCode) {
            return $this->failValidationErrors('ID / order_code diperlukan');
        }

        if (ctype_digit((string) $idOrCode)) {
            $order = $this->model->find((int) $idOrCode);
        } else {
            $order = $this->model->where('order_code', $idOrCode)->first();
        }

        if (!$order) {
            return $this->failNotFound('Order tidak ditemukan');
        }

        $order['items'] = $this->orderItemModel
            ->where('order_id', $order['id'])
            ->findAll();

        $userModel = new UserModel();

        $agen = $userModel->find($order['agen_id']);
        $distributor = $userModel->find($order['distributor_id']);
        $pabrik = $userModel->find($order['pabrik_id']);

        $order['agen'] = $agen['name'] ?? 'Agen tidak dikenal';
        $order['distributor'] = $distributor['name'] ?? 'Distributor tidak dikenal';
        $order['pabrik_name'] = $pabrik['name'] ?? 'Pabrik tidak dikenal';

        $invoiceModel = new \App\Models\InvoiceModel();
        $invoice = $invoiceModel->where('order_id', $order['id'])->first();

        $order['status_pembayaran'] = ($invoice && $invoice['status'] === 'paid') ? 'Lunas' : 'Belum Dibayar';

        return $this->respond($order);
    }


    public function update($id = null)
    {

        if (!$id) {
            return $this->failValidationErrors('ID diperlukan');
        }

        if (!$this->model->find($id)) {
            return $this->failNotFound('Order tidak ditemukan');
        }

        $payload = $this->request->getJSON(true);
        if (!$payload) {
            return $this->failValidationErrors('Payload tidak valid');
        }

        log_message('debug', 'Payload: ' . json_encode($payload));
        $allowed = [
            'agen_id',
            'distributor_id',
            'pabrik_id',
            'status',
            'order_date',
            'delivery_date',
            'resi',
            'accepted_at',
            'note'
        ];
        $orderData = array_intersect_key($payload, array_flip($allowed));

        log_message('debug', 'OrderData: ' . json_encode($orderData));

        $this->model->update($id, $orderData);

        $order = $this->model->find($id);
        $order['items'] = $this->orderItemModel->where('order_id', $id)->findAll();

        $userModel = new UserModel();
        $agen = $userModel->find($order['agen_id']);
        $distributor = $userModel->find($order['distributor_id']);

        $order['agen'] = $agen['name'] ?? 'Agen tidak dikenal';
        $order['distributor'] = $distributor['name'] ?? 'Distributor tidak dikenal';

        if (isset($payload['status'])) {
            $notifModel = new NotificationModel();

            $statusMap = [
                'pending'           => 'Tertunda',
                'approved'          => 'Disetujui',
                'shipped'           => 'Dikirim',
                'processing'        => 'Sedang Diproduksi',
                'produced'          => 'Selesai Produksi',
                'selesai produksi'  => 'Selesai Produksi',
                'cancelled'         => 'Ditolak',
                'delivered'         => 'Diterima',
                'unpaid'            => 'Belum Dibayar',
                'paid'              => 'Lunas',
                'belum dikirim'     => 'Belum Dikirim',
                'dikirim'           => 'Dikirim',
                'diterima'          => 'Diterima',
            ];

            $statusKey = strtolower(trim($payload['status']));
            $statusIndo = $statusMap[$statusKey] ?? $payload['status'];

            if (!empty($order['agen_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['agen_id'],
                    'title'      => 'Status Pesanan Diperbarui',
                    'message'    => 'Selamat pesanan Anda sekarang berstatus: ' . $statusIndo,
                    'type'       => 'order_updated',
                    'is_read'    => 0,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }

            if (!empty($order['distributor_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['distributor_id'],
                    'title'      => 'Status Pesanan Diubah',
                    'message'    => 'Pesanan dari ' . ($agen['name'] ?? '-') . ' kini berstatus: ' . $statusIndo,
                    'type'       => 'order_status_change',
                    'is_read'    => 0,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }

            if (!empty($order['pabrik_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['pabrik_id'],
                    'title'      => 'Status Order dari Distributor Diubah',
                    'message'    => 'Order dengan kode ' . $order['order_code'] . ' sekarang berstatus: ' . $statusIndo,
                    'type'       => 'order_status_change',
                    'is_read'    => 0,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }

        return $this->respond([
            'message' => 'Order berhasil diperbarui',
            'data'    => $order
        ]);
    }

    public function delete($id = null)
    {
        if (!$id) {
            return $this->failValidationErrors('ID diperlukan');
        }

        if (!$this->model->find($id)) {
            return $this->failNotFound('Order tidak ditemukan');
        }

        $this->model->delete($id);

        return $this->respondDeleted(['message' => 'Order berhasil dihapus']);
    }

    public function updateItemPrice($orderId = null)
    {
        $payload = $this->request->getJSON(true);

        if (!$orderId || !isset($payload['product_name']) || !isset($payload['unit_price'])) {
            return $this->failValidationErrors('Data tidak lengkap');
        }

        $updated = $this->orderItemModel
            ->where('order_id', $orderId)
            ->where('product_name', $payload['product_name'])
            ->set(['unit_price' => $payload['unit_price']])
            ->update();

        if ($updated === false) {
            return $this->failServerError('Gagal memperbarui harga');
        }

        return $this->respondUpdated(['message' => 'Harga berhasil diperbarui']);
    }

    public function countAgen($agenId = null)
    {
        $agenId = $agenId ?? $this->request->getGet('agen_id');

        if (!$agenId) {
            return $this->failValidationErrors('Parameter agen_id diperlukan');
        }

        $orderCount = $this->model
            ->where('agen_id', (int)$agenId)
            ->countAllResults();

        $nextOrderNumber = $orderCount + 1;

        $nextOrderId = 'ORD-' . str_pad($nextOrderNumber, 3, '0', STR_PAD_LEFT);

        return $this->respond([
            'count'     => $orderCount,
            'order_id'  => $nextOrderId,
            'message'   => 'Order ID berikutnya berhasil dihasilkan untuk agen ini'
        ]);
    }

    public function findByAgenAndNo()
    {
        $agenId = $this->request->getGet('agen_id');
        $orderNo = $this->request->getGet('agent_order_no');

        if (!$agenId || !$orderNo) {
            return $this->failValidationErrors('agen_id dan agent_order_no diperlukan');
        }

        $order = $this->model
            ->where('agen_id', (int) $agenId)
            ->where('agent_order_no', (int) $orderNo)
            ->first();

        if (!$order) {
            return $this->failNotFound('Order tidak ditemukan');
        }

        $order['items'] = $this->orderItemModel
            ->where('order_id', $order['id'])
            ->findAll();

        $userModel = new UserModel();
        $agen = $userModel->find($order['agen_id']);
        $distributor = $userModel->find($order['distributor_id']);

        $order['agen'] = $agen['name'] ?? 'Agen tidak dikenal';
        $order['distributor'] = $distributor['name'] ?? 'Distributor tidak dikenal';

        return $this->respond($order);
    }

    public function getRiwayatOrders()
    {
        $db = \Config\Database::connect();

        $orders = $db->table('orders o')
            ->select('o.*, 
                  i.status AS invoice_status, 
                  agen.name as agen, 
                  distributor.name as distributor')
            ->join('invoices i', 'i.order_id = o.id AND i.agen_id IS NOT NULL', 'left')
            ->join('users agen', 'o.agen_id = agen.id', 'left')
            ->join('users distributor', 'o.distributor_id = distributor.id', 'left')
            ->whereIn('o.status', ['delivered', 'cancelled'])
            ->get()
            ->getResultArray();

        if (empty($orders)) {
            return $this->respond([]);
        }

        $orderIds = array_column($orders, 'id');

        $itemsRaw = $db->table('order_items')
            ->whereIn('order_id', $orderIds)
            ->get()->getResultArray();

        $groupedItems = [];
        foreach ($itemsRaw as $item) {
            $groupedItems[$item['order_id']][] = $item;
        }

        $kodeProdukUnik = array_unique(array_column($itemsRaw, 'kode_produk'));

        $hargaProdukMap = [];
        foreach ($kodeProdukUnik as $kode) {
            if ($kode === null) continue;

            $hargaRow = $db->table('product_prices')
                ->where('role', 'pabrik')
                ->where('kode_produk', $kode)
                ->orderBy('created_at', 'DESC')
                ->limit(1)
                ->get()
                ->getRowArray();

            if ($hargaRow) {
                $hargaProdukMap[$kode] = (float) $hargaRow['harga'];
            }
        }

        $hargaMapPabrik = [];
        $hargaMapJual = [];

        foreach ($itemsRaw as $item) {
            $orderId = $item['order_id'];
            $kodeProduk = $item['kode_produk'] ?? null;
            $qty = (int)$item['quantity'];
            $hargaPabrik = $hargaProdukMap[$kodeProduk] ?? 0;
            $hargaJual = (float)($item['requested_price'] ?? $item['unit_price'] ?? 0);

            if (!isset($hargaMapPabrik[$orderId])) $hargaMapPabrik[$orderId] = 0;
            if (!isset($hargaMapJual[$orderId])) $hargaMapJual[$orderId] = 0;

            $hargaMapPabrik[$orderId] += $hargaPabrik * $qty;
            $hargaMapJual[$orderId] += $hargaJual * $qty;
        }

        foreach ($orders as &$order) {
            $items = $groupedItems[$order['id']] ?? [];

            foreach ($items as &$item) {
                $kodeProduk = $item['kode_produk'] ?? null;
                $item['harga_pabrik'] = $hargaProdukMap[$kodeProduk] ?? 0;
            }
            $order['items'] = $items;
            $order['statusPembayaran'] = ($order['invoice_status'] === 'paid') ? 'Lunas' : 'Belum Dibayar';
            $order['totalHargaPabrik'] = $hargaMapPabrik[$order['id']] ?? 0;
            $order['hargaJual'] = $hargaMapJual[$order['id']] ?? 0;
        }

        return $this->respond($orders);
    }

    public function getOrderById($id)
    {
        $db = \Config\Database::connect();

        // Detail order
        $order = $db->table('orders o')
            ->select('o.*, 
              i.status AS invoice_status, 
              agen.name as agenName, 
              distributor.name as distributor')
            ->join('invoices i', 'i.order_id = o.id', 'left')
            ->join('users agen', 'o.agen_id = agen.id', 'left')
            ->join('users distributor', 'o.distributor_id = distributor.id', 'left')
            ->where('o.id', $id)
            ->get()
            ->getRowArray();

        if (!$order) {
            return $this->failNotFound("Order dengan ID $id tidak ditemukan.");
        }

        // items
        $items = $db->table('order_items')
            ->where('order_id', $id)
            ->get()
            ->getResultArray();

        // harga pabrik
        $kodeProdukUnik = array_unique(array_column($items, 'kode_produk'));
        $hargaProdukMap = [];
        foreach ($kodeProdukUnik as $kode) {
            if (!$kode) continue;

            $hargaRow = $db->table('product_prices')
                ->where('role', 'pabrik')
                ->where('kode_produk', $kode)
                ->orderBy('created_at', 'DESC')
                ->limit(1)
                ->get()
                ->getRowArray();

            if ($hargaRow) {
                $hargaProdukMap[$kode] = (float) $hargaRow['harga'];
            }
        }

        $totalHargaPabrik = 0;
        $totalHargaJual = 0;

        foreach ($items as &$item) {
            $kode = $item['kode_produk'] ?? null;
            $qty = (int) $item['quantity'];
            $hargaPabrik = $hargaProdukMap[$kode] ?? 0;
            $hargaJual = (float)($item['requested_price'] ?? $item['unit_price'] ?? 0);

            $item['harga_pabrik'] = $hargaPabrik;

            $totalHargaPabrik += $hargaPabrik * $qty;
            $totalHargaJual += $hargaJual * $qty;
        }

        $order['items'] = $items;
        $order['totalHargaPabrik'] = $totalHargaPabrik;
        $order['hargaJual'] = $totalHargaJual;
        $order['statusPembayaran'] = (strtolower($order['invoice_status']) === 'paid') ? 'Lunas' : 'Belum Dibayar';
        $order['status_pembayaran'] = $order['statusPembayaran'];

        return $this->respond($order);
    }

    public function getMonitoringOrders()
    {
        $db = db_connect();
        $session = session();
        $userId = $session->get('user_id');

        if (!$userId) {
            return $this->failUnauthorized('User ID distributor tidak ditemukan.');
        }

        $orders = $db->table('orders o')
            ->select("
        o.id as order_id,
        o.order_code,
        o.status,
        o.order_date,
        o.pabrik_id,
        o.agen_id,
        o.distributor_id,
        distributor.name as distributorName,
        agen.name as agenName,
        pabrik.name as pabrikName
    ")
            ->join('users distributor', 'distributor.id = o.distributor_id', 'left')
            ->join('users agen', 'agen.id = o.agen_id', 'left')
            ->join('users pabrik', 'pabrik.id = o.pabrik_id', 'left')
            ->where('o.distributor_id', $userId)
            ->where('o.agen_id IS NOT NULL')
            ->where('o.pabrik_id IS NULL')
            ->whereIn('o.status', ['approved', 'processing', 'produced', 'shipped', 'delivered'])
            ->orderBy('o.order_date', 'DESC')
            ->get()
            ->getResultArray();

        $invoiceModel = new \App\Models\InvoiceModel();
        $invoices = $invoiceModel
            ->whereIn('order_id', array_column($orders, 'order_id'))
            ->where('pabrik_id', null)
            ->where('agen_id !=', null)
            ->where('distributor_id !=', null)
            ->findAll();

        $invoiceMap = [];
        foreach ($invoices as $inv) {
            if (!empty($inv['agen_id']) && !empty($inv['distributor_id']) && empty($inv['pabrik_id'])) {
                $invoiceMap[$inv['order_id']] = [
                    'id'     => $inv['id'],
                    'status' => strtolower($inv['status']),
                ];
            }
        }

        foreach ($orders as &$order) {
            $invoice = $invoiceMap[$order['order_id']] ?? null;

            if ($invoice) {
                $order['invoiceId'] = $invoice['id'];
                $order['statusPembayaran'] = $invoice['status'];
                $order['invoiceExist'] = true;
            } else {
                $order['invoiceId'] = null;
                $order['statusPembayaran'] = null;
                $order['invoiceExist'] = false;
            }
        }
        return $this->respond($orders);
    }

    public function updateOrderStatus($orderId)
    {
        $db = \Config\Database::connect();
        $json = $this->request->getJSON();

        if (!isset($json->status)) {
            return $this->failValidationErrors('Status tidak boleh kosong.');
        }
        $update = $db->table('orders')
            ->where('id', $orderId)
            ->update(['status' => $json->status]);

        if ($update) {
            return $this->respond(['message' => 'Status berhasil diupdate.']);
        } else {
            return $this->fail('Gagal mengupdate status.');
        }
    }
}
