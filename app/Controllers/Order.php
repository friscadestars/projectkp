<?php

namespace App\Controllers;

use App\Models\OrderModel;
use CodeIgniter\RESTful\ResourceController;

class Order extends ResourceController
{
    protected $modelName = OrderModel::class;
    protected $format    = 'json';

    // Ambil semua order
    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    // Tambah order
    public function create()
    {
        $data = $this->request->getJSON(true);
        if (!$data) return $this->fail('Data tidak valid');

        $this->model->insert($data);
        return $this->respondCreated(['message' => 'Order berhasil dibuat']);
    }

    // Ambil satu order
    public function show($id = null)
    {
        $order = $this->model->find($id);
        if (!$order) return $this->failNotFound('Order tidak ditemukan');

        return $this->respond($order);
    }

    // Update order
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->find($id)) return $this->failNotFound('Order tidak ditemukan');

        $this->model->update($id, $data);
        return $this->respond(['message' => 'Order berhasil diperbarui']);
    }

    // Hapus order
    public function delete($id = null)
    {
        if (!$this->model->find($id)) return $this->failNotFound('Order tidak ditemukan');

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Order berhasil dihapus']);
    }
}
