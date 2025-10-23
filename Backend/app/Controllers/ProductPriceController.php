<?php

namespace App\Controllers;

use App\Models\ProductPriceModel;
use CodeIgniter\RESTful\ResourceController;

class ProductPriceController extends ResourceController
{
    protected $modelName = ProductPriceModel::class;
    protected $format    = 'json';

    public function index()
    {
        $role = $this->request->getGet('role');
        $distributorId = $this->request->getGet('distributor_id');

        $query = $this->model->orderBy('id', 'DESC');

        if ($role) {
            $query->where('role', $role);
        }

        if ($distributorId) {
            $query->where('distributor_id', $distributorId);
        }

        $data = $query->findAll();
        return $this->respond($data);
    }

    public function create()
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

        if (!isset($data['role'])) {
            $data['role'] = 'distributor';
        }

        if ($data['role'] === 'distributor') {
            if (!isset($data['distributor_id'])) {
                return $this->failValidationErrors('distributor_id wajib diisi untuk role distributor');
            }
        }

        if ($this->model->insert($data)) {
            return $this->respondCreated(['message' => 'Harga produk berhasil ditambahkan']);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        return $data ? $this->respond($data) : $this->failNotFound('Data tidak ditemukan');
    }

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

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Data berhasil dihapus']);
        }
        return $this->failNotFound('Data tidak ditemukan');
    }
}
