<?php

namespace App\Controllers;

use App\Models\ProductPriceModel;
use CodeIgniter\RESTful\ResourceController;

class ProductPriceController extends ResourceController
{
    protected $modelName = ProductPriceModel::class;
    protected $format    = 'json';

    // GET /api/prices
    public function index()
    {
        $role = $this->request->getGet('role'); // dari query string: ?role=distributor

        $query = $this->model->orderBy('id', 'DESC');

        if ($role) {
            $query->where('role', $role);
        }

        $data = $query->findAll();
        return $this->respond($data);
    }

    // POST /api/prices
    public function create()
    {
        $data = $this->request->getJSON(true);

        // Map jika frontend kirim 'nama' dan 'kode'
        if (isset($data['nama'])) {
            $data['nama_produk'] = $data['nama'];
            unset($data['nama']);
        }
        if (isset($data['kode'])) {
            $data['kode_produk'] = $data['kode'];
            unset($data['kode']);
        }

        if (!isset($data['role'])) {
            $data['role'] = 'distributor'; // default kalau tidak dikirim
        }

        if ($this->model->insert($data)) {
            return $this->respondCreated(['message' => 'Harga produk berhasil ditambahkan']);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // GET /api/prices/{id}
    public function show($id = null)
    {
        $data = $this->model->find($id);
        return $data ? $this->respond($data) : $this->failNotFound('Data tidak ditemukan');
    }

    // PUT /api/prices/{id}
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (isset($data['nama'])) {
            $data['nama_produk'] = $data['nama'];
            unset($data['nama']);
        }
        if (isset($data['kode'])) {
            $data['kode_produk'] = $data['kode'];
            unset($data['kode']);
        }

        if ($this->model->update($id, $data)) {
            return $this->respond(['message' => 'Data berhasil diperbarui']);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // DELETE /api/prices/{id}
    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Data berhasil dihapus']);
        }
        return $this->failNotFound('Data tidak ditemukan');
    }
}
