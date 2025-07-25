<?php

namespace App\Controllers;

use App\Models\OrderModel;
use App\Models\OrderItemModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\Database\Exceptions\DatabaseException;
use App\Models\UserModel;

class OrderController extends ResourceController
{
    protected $modelName = OrderModel::class;
    protected $format    = 'json';

    /**
     * @var OrderItemModel
     */
    protected $orderItemModel;

    public function __construct()
    {
        $this->orderItemModel = new OrderItemModel();
    }

    public function index()
    {
        $orders = $this->model->orderBy('id', 'DESC')->findAll();

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

        // Kumpulkan semua user id (agen & distributor) dari list order
        $userIds = [];
        foreach ($orders as $order) {
            if (!empty($order['agen_id'])) {
                $userIds[] = (int) $order['agen_id'];
            }
            if (!empty($order['distributor_id'])) {
                $userIds[] = (int) $order['distributor_id'];
            }
        }

        // Ambil nama user2 tsb
        $userMap = [];
        if (!empty($userIds)) {
            $userModel = new UserModel();
            $users = $userModel->whereIn('id', array_unique($userIds))->findAll();

            foreach ($users as $u) {
                $userMap[(int) $u['id']] = $u['name'];
            }
        }

        // Bentuk response final
        foreach ($orders as &$order) {
            $order['items'] = $grouped[$order['id']] ?? [];

            $order['agen'] = $userMap[(int) $order['agen_id']] ?? 'Nama tidak ditemukan';
            $order['distributor'] = $userMap[(int) $order['distributor_id']] ?? 'Nama tidak ditemukan';

            $order['order_code'] = $order['order_code'] ?? sprintf('ord-%03d', $order['agent_order_no'] ?? 0); // ✅

            unset($order['agen_id'], $order['distributor_id']);
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
            unset($order['agen_id'], $order['distributor_id']);

            return $this->respondCreated([
                'message' => 'Order berhasil dibuat',
                'data'    => $order
            ]);
        } catch (\Throwable $e) {
            $db->transRollback();
            return $this->failServerError($e->getMessage());
        }
    }

    public function show($id = null)
    {
        if (!$id) {
            return $this->failValidationErrors('ID diperlukan');
        }

        $order = $this->model->find($id);
        if (!$order) {
            return $this->failNotFound('Order tidak ditemukan');
        }

        $order['items'] = $this->orderItemModel
            ->where('order_id', $id)
            ->findAll();

        $userModel = new UserModel();
        $agen = $userModel->find($order['agen_id']);
        $distributor = $userModel->find($order['distributor_id']);

        $order['agen'] = $agen['name'] ?? 'Agen tidak dikenal';
        $order['distributor'] = $distributor['name'] ?? 'Distributor tidak dikenal';

        unset($order['agen_id'], $order['distributor_id']);

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

        $this->model->update($id, $orderData);

        $order = $this->model->find($id);
        $order['items'] = $this->orderItemModel->where('order_id', $id)->findAll();

        $userModel = new UserModel();
        $agen = $userModel->find($order['agen_id']);
        $distributor = $userModel->find($order['distributor_id']);

        $order['agen'] = $agen['name'] ?? 'Agen tidak dikenal';
        $order['distributor'] = $distributor['name'] ?? 'Distributor tidak dikenal';

        unset($order['agen_id'], $order['distributor_id']);

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
}
