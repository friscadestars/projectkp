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
            if ($order['agen_id']) {
                $userIds[] = $order['agen_id'];
            }
            if (!empty($order['distributor_id'])) {
                $userIds[] = $order['distributor_id'];
            }
        }

        $userModel = new UserModel();
        $users = $userModel->whereIn('id', array_unique($userIds))->findAll();

        $userMap = [];
        foreach ($users as $u) {
            $userMap[$u['id']] = $u['name'];
        }

        foreach ($orders as &$order) {
            $order['items'] = $grouped[$order['id']] ?? [];
            $order['agen_name'] = $userMap[$order['agen_id']] ?? 'Agen tidak dikenal';
            $order['distributor_name'] = $userMap[$order['distributor_id']] ?? 'Distributor tidak dikenal';
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

            // 🔧 Tambahkan nama agen dan distributor
            $userModel = new UserModel();
            $agen = $userModel->find($order['agen_id']);
            $distributor = $userModel->find($order['distributor_id']);
            $order['agen_name'] = $agen['name'] ?? 'Agen tidak dikenal';
            $order['distributor_name'] = $distributor['name'] ?? 'Distributor tidak dikenal';

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

        // 🔧 Tambahkan nama agen dan distributor
        $userModel = new UserModel();
        $agen = $userModel->find($order['agen_id']);
        $distributor = $userModel->find($order['distributor_id']);
        $order['agen_name'] = $agen['name'] ?? 'Agen tidak dikenal';
        $order['distributor_name'] = $distributor['name'] ?? 'Distributor tidak dikenal';

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

        // 🔧 Tambahkan nama agen dan distributor
        $userModel = new UserModel();
        $agen = $userModel->find($order['agen_id']);
        $distributor = $userModel->find($order['distributor_id']);
        $order['agen_name'] = $agen['name'] ?? 'Agen tidak dikenal';
        $order['distributor_name'] = $distributor['name'] ?? 'Distributor tidak dikenal';

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
}
