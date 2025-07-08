<?php

namespace App\Controllers;

use App\Models\InvoiceModel;
use CodeIgniter\RESTful\ResourceController;

class InvoiceController extends ResourceController
{
    protected $modelName = 'App\Models\InvoiceModel';
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $invoice = $this->model->find($id);
        if (!$invoice) {
            return $this->failNotFound('Invoice tidak ditemukan');
        }
        return $this->respond($invoice);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$this->model->insert($data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        return $this->respondCreated([
            'message' => 'Invoice berhasil dibuat',
            'id' => $this->model->getInsertID()
        ]);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        return $this->respond([
            'message' => 'Invoice berhasil diperbarui'
        ]);
    }

    public function delete($id = null)
    {
        if (!$this->model->find($id)) {
            return $this->failNotFound('Invoice tidak ditemukan');
        }

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Invoice berhasil dihapus']);
    }
}
