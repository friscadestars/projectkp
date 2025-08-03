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
            'order_date'     => $payload['order_date'],
            'delivery_date'  => $payload['delivery_date'] ?? null,
            'resi'           => $payload['resi'] ?? null,
            'accepted_at'    => $payload['accepted_at'] ?? null,
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

            return $this->respondCreated([
                'message' => 'Order berhasil dibuat',
                'data'    => $order
            ]);
        } catch (\Throwable $e) {
            $db->transRollback();
            return $this->failServerError($e->getMessage());
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

        // 🚨 Tetap kirim agen_id ke FE
        // unset($order['agen_id']); // <-- jangan hapus ini

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

        // unset($order['agen_id'], $order['distributor_id']);

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

        // Ambil jumlah order yang sudah pernah dilakukan agen ini
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

        // unset($order['agen_id'], $order['distributor_id']);

        return $this->respond($order);
    }

    public function moveToHistory($orderId = null)
    {
        if (!$orderId) {
            return $this->failValidationErrors('ID order diperlukan');
        }

        $order = $this->model->find($orderId);
        if (!$order) {
            return $this->failNotFound('Order tidak ditemukan');
        }

        if ($order['status'] !== 'delivered') {
            return $this->failValidationErrors('Order belum berstatus "delivered"');
        }

        $orderItems = $this->orderItemModel->where('order_id', $orderId)->findAll();
        if (!$orderItems) {
            return $this->failNotFound('Item order tidak ditemukan');
        }

        // Hitung total harga
        $totalHarga = 0;
        foreach ($orderItems as $item) {
            $totalHarga += $item['unit_price'] * $item['quantity'];
        }

        // Ambil nama distributor
        $userModel = new UserModel();
        $distributor = $userModel->find($order['distributor_id']);
        $distributorName = $distributor['name'] ?? 'Tidak diketahui';

        // Simpan ke riwayat_orders
        $riwayatModel = new RiwayatOrderModel();

        // Cek jika sudah ada sebelumnya
        $existing = $riwayatModel->where('order_id', $orderId)->first();
        if ($existing) {
            return $this->failValidationErrors('Order sudah pernah dipindahkan ke riwayat');
        }

        $riwayatData = [
            'order_id'       => (string) $order['id'],
            'order_code'     => $order['order_code'],
            'distributor'    => $distributorName,
            'tanggal_order'  => $order['order_date'],
            'tanggal_terima' => $order['accepted_at'],
            'no_resi'        => $order['resi'],
            'total_harga'    => $totalHarga,
            'status_order'   => $order['status'],
        ];

        $riwayatModel->insert($riwayatData);

        // Hapus dari order_items dan orders
        $this->orderItemModel->where('order_id', $orderId)->delete();
        $this->model->delete($orderId);

        return $this->respondCreated([
            'message' => 'Order berhasil dipindahkan ke riwayat dan dihapus dari orders',
            'data'    => $riwayatData
        ]);
    }
}
