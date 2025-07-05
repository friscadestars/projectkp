<?php

namespace App\Controllers;

use App\Models\ShipmentModel;
use CodeIgniter\RESTful\ResourceController;

class ShipmentController extends ResourceController
{
    protected $modelName = 'App\Models\ShipmentModel';
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        return $data
            ? $this->respond($data)
            : $this->failNotFound("Pengiriman dengan ID $id tidak ditemukan.");
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->insert($data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        return $this->respondCreated([
            'message' => 'Data pengiriman berhasil ditambahkan',
            'id'      => $this->model->getInsertID()
        ]);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        return $this->respond(['message' => 'Data pengiriman berhasil diperbarui']);
    }

    public function delete($id = null)
    {
        if (!$this->model->find($id)) {
            return $this->failNotFound("Pengiriman tidak ditemukan.");
        }

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Pengiriman berhasil dihapus']);
    }
}
