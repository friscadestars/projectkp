<?php

namespace App\Controllers;

use App\Models\OrderItemModel;
use CodeIgniter\RESTful\ResourceController;

class OrderItem extends ResourceController
{
    protected $modelName = OrderItemModel::class;
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$data || !isset($data['order_id'], $data['product_name'], $data['quantity'], $data['unit_price'], $data['address'])) {
            return $this->failValidationErrors('Semua field wajib diisi: order_id, product_name, quantity, unit_price, address');
        }

        $this->model->insert($data);
        return $this->respondCreated(['message' => 'Item berhasil ditambahkan']);
    }

    public function show($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) return $this->failNotFound('Item tidak ditemukan');

        return $this->respond($item);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->find($id)) return $this->failNotFound('Item tidak ditemukan');

        $this->model->update($id, $data);
        return $this->respond(['message' => 'Item berhasil diperbarui']);
    }

    public function delete($id = null)
    {
        if (!$this->model->find($id)) return $this->failNotFound('Item tidak ditemukan');

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Item berhasil dihapus']);
    }
}
