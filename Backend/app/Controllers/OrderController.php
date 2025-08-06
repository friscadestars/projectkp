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
        // 🔐 Ambil user dari token
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

        // 🔍 Filter berdasarkan role
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

        // Ambil semua item untuk order yang ada
        $orderIds = array_column($orders, 'id');
        $items = $this->orderItemModel
            ->whereIn('order_id', $orderIds)
            ->findAll();

        $grouped = [];
        foreach ($items as $item) {
            $grouped[$item['order_id']][] = $item;
        }

        // Ambil semua user id dari list order
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

        // Bentuk response akhir
        foreach ($orders as &$order) {
            $order['items'] = $grouped[$order['id']] ?? [];

            $order['agen'] = $userMap[(int) $order['agen_id']] ?? 'Nama tidak ditemukan';
            $order['distributor'] = $userMap[(int) $order['distributor_id']] ?? 'Nama tidak ditemukan';
            $order['pabrik_name'] = $userMap[(int) $order['pabrik_id']] ?? 'Pabrik tidak dikenal';

            $order['order_code'] = $order['order_code'] ?? sprintf('ord-%03d', $order['agent_order_no'] ?? 0);
            $order['agen_id'] = $order['agen_id'] ?? null;
            $order['distributor_id'] = $order['distributor_id'] ?? null;
        }

        // Ambil semua order ID
        $orderIds = array_column($orders, 'id');

        // Ambil semua invoice berdasarkan order_id
        $invoiceModel = new \App\Models\InvoiceModel();
        $invoices = $invoiceModel->whereIn('order_id', $orderIds)->findAll();

        // Petakan status invoice berdasarkan order_id
        $invoiceMap = [];
        foreach ($invoices as $inv) {
            $invoiceMap[$inv['order_id']] = $inv['status'];
        }

        // Tambahkan status pembayaran ke setiap order
        foreach ($orders as &$order) {
            $statusInvoice = $invoiceMap[$order['id']] ?? null;
            $order['status_pembayaran'] = $statusInvoice === 'paid' ? 'Lunas' : 'Belum Dibayar';
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
            'status'     => 'required|in_list[pending,processing,shipped,delivered,cancelled,approved]',
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

            // kembalikan nama, dan hapus id jika tidak ingin ditampilkan
            $order['agen'] = $agen['name'] ?? 'Agen tidak dikenal';
            $order['distributor'] = $distributor['name'] ?? 'Distributor tidak dikenal';
            $order['agen_id'] = $order['agen_id'];
            $order['distributor_id'] = $order['distributor_id'];
            // unset($order['agen_id'], $order['distributor_id']);

            $notifModel = new NotificationModel();

            // Notifikasi untuk Distributor
            if (!empty($order['distributor_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['distributor_id'],
                    'title'      => 'Pesanan Baru Masuk',
                    'message'    => ($agen['name'] ?? 'Agen tidak dikenal') . ' telah membuat pesanan baru.',
                    'type'       => 'order_created',
                    'is_read'    => 0,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }

            // Notifikasi untuk Agen (konfirmasi bahwa pesanan berhasil dibuat)
            if (!empty($order['agen_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['agen_id'],
                    'title'      => 'Pesanan Berhasil Dikirim',
                    'message'    => 'Pesanan Anda berhasil dikirim ke distributor.',
                    'type'       => 'order_sent',
                    'is_read'    => 0,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }

            // Notifikasi untuk Pabrik (jika sudah ditentukan sejak awal)
            if (!empty($order['pabrik_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['pabrik_id'],
                    'title'      => 'Permintaan Order Baru',
                    'message'    => 'Distributor menerima pesanan dan mengarahkannya ke Anda.',
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

        $productPriceModel = new ProductPriceModel(); // buat instansiasi model

        foreach ($products as $p) {
            $harga = $p['harga'] ?? $p['unit_price'] ?? 0;

            // cek jika role adalah pabrik → ambil harga dari tabel product_prices
            if (isset($orderData['pabrik_id'])) {
                $kodeProduk = $p['kode'] ?? $p['kode_produk'] ?? null;

                if ($kodeProduk) {
                    $hargaData = $productPriceModel
                        ->where('kode_produk', $kodeProduk)
                        ->where('role', 'pabrik')
                        ->orderBy('created_at', 'desc')
                        ->first();

                    if ($hargaData) {
                        $harga = $hargaData['harga']; // override harga
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

            // Notif ke agen
            if (!empty($order['agen_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['agen_id'],
                    'title'      => 'Status Pesanan Diperbarui',
                    'message'    => 'Pesanan Anda sekarang berstatus: ' . $payload['status'],
                    'type'       => 'order_updated',
                    'is_read'    => 0,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }

            // Notif ke distributor
            if (!empty($order['distributor_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['distributor_id'],
                    'title'      => 'Status Pesanan Diubah',
                    'message'    => 'Pesanan dari' . ($agen['name'] ?? '-') . ' kini berstatus: ' . $payload['status'],
                    'type'       => 'order_status_change',
                    'is_read'    => 0,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }

            // Notif ke pabrik
            if (!empty($order['pabrik_id'])) {
                $notifModel->insert([
                    'user_id'    => $order['pabrik_id'],
                    'title'      => 'Status Order dari Distributor Diubah',
                    'message'    => 'Order dengan kode ' . $order['order_code'] . ' sekarang berstatus: ' . $payload['status'],
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
            ->join('invoices i', 'i.order_id = o.id', 'left')
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

        // Gabungkan semua ke dalam data order
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

        // Ambil detail order
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

        // Ambil items
        $items = $db->table('order_items')
            ->where('order_id', $id)
            ->get()
            ->getResultArray();

        // Ambil harga pabrik terbaru
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

        // Hitung total harga pabrik dan jual
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

        // Masukkan data tambahan seperti di getRiwayatOrders
        $order['items'] = $items;
        $order['totalHargaPabrik'] = $totalHargaPabrik;
        $order['hargaJual'] = $totalHargaJual;
        $order['statusPembayaran'] = (strtolower($order['invoice_status']) === 'paid') ? 'Lunas' : 'Belum Dibayar';
        $order['status_pembayaran'] = $order['statusPembayaran'];

        return $this->respond($order);
    }

    public function getMonitoringOrders()
    {
        $db = \Config\Database::connect();

        $orders = $db->table('orders o')
            ->select('o.*, i.status as invoice_status, agen.name as agenName, pabrik.name as pabrikName')
            ->join('users agen', 'o.agen_id = agen.id', 'left')
            ->join('users pabrik', 'o.pabrik_id = pabrik.id', 'left')
            ->join('invoices i', 'i.order_id = o.id', 'left')
            ->whereIn('o.status', ['approved', 'processing', 'shipped'])
            ->orderBy('o.created_at', 'DESC')
            ->get()
            ->getResultArray();

        foreach ($orders as &$order) {
            $order['invoiceExist'] = !empty($order['invoice_status']);
        }

        return $this->respond($orders);
    }
}
