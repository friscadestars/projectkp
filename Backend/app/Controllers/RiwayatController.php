<?php

namespace App\Controllers;

use App\Models\RiwayatOrderModel;
use CodeIgniter\RESTful\ResourceController;

class RiwayatOrderController extends ResourceController
{
    protected $modelName = RiwayatOrderModel::class;
    protected $format = 'json';

    // GET: /api/riwayat
    public function index()
    {
        $data = $this->model->findAll();
        return $this->respond($data);
    }

    // POST: /api/riwayat
    public function create()
    {
        $data = $this->request->getJSON(true);
        if ($this->model->insert($data)) {
            return $this->respondCreated(['message' => 'Riwayat order berhasil ditambahkan']);
        }
        return $this->failValidationErrors($this->model->errors());
    }

    // GET: /api/riwayat/{id}
    public function show($id = null)
    {
        $data = $this->model->find($id);
        return $data ? $this->respond($data) : $this->failNotFound('Data tidak ditemukan');
    }

    // PUT: /api/riwayat/{id}
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        if ($this->model->update($id, $data)) {
            return $this->respond(['message' => 'Data berhasil diperbarui']);
        }
        return $this->failValidationErrors($this->model->errors());
    }

    // DELETE: /api/riwayat/{id}
    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Data berhasil dihapus']);
        }
        return $this->failNotFound('Data tidak ditemukan');
    }
}
