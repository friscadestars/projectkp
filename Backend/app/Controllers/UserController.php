<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class UserController extends ResourceController
{
    protected $userModel;
    protected $format = 'json';

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function index()
    {
        $role = $this->request->getGet('role');

        $builder = $this->userModel->select([
            'id',
            'name',
            'email',
            'role',
            'no_telp',
            'alamat',
            'nama_rekening',
            'rekening',
            'nama_bank',
            'is_active',
            'created_at',
        ]);

        if (!empty($role)) {
            $builder->where('role', $role);
        }

        $users = $builder->findAll();

        return $this->respond($users);
    }

    public function show($id = null)
    {
        $data = $this->userModel
            ->select('id, name, email, role, no_telp, alamat, nama_rekening, rekening, nama_bank, created_at')
            ->find($id);

        if (!$data) {
            return $this->failNotFound('User tidak ditemukan');
        }

        return $this->respond($data);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if (!$data) {
            return $this->failValidationErrors('Payload tidak valid');
        }

        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        if (!$this->userModel->insert($data)) {
            return $this->failValidationErrors($this->userModel->errors());
        }

        $insertedId = $this->userModel->getInsertID();

        if (isset($data['role']) && $data['role'] === 'distributor') {
            $distributorPabrikModel = new \App\Models\DistributorPabrikModel();

            $success = $distributorPabrikModel->insert([
                'distributor_id' => $insertedId,
                'pabrik_id'      => 1,
                'created_at'     => date('Y-m-d H:i:s')
            ]);

            if (!$success) {
                log_message('error', 'Gagal insert ke distributor_pabrik: ' . print_r($distributorPabrikModel->errors(), true));
            }
        }

        return $this->respondCreated([
            'message' => 'User berhasil dibuat',
            'id'      => $insertedId
        ]);
    }

    public function update($id = null)
    {
        if (!$this->userModel->find($id)) {
            return $this->failNotFound('User tidak ditemukan');
        }

        $data = $this->request->getJSON(true);
        if (!$data) {
            return $this->failValidationErrors('Payload tidak valid');
        }

        $payload = [
            'name'           => $data['name']           ?? null,
            'email'          => $data['email']          ?? null,
            'no_telp'        => $data['no_telp']        ?? null,
            'alamat'         => $data['alamat']         ?? null,
            'nama_rekening'  => $data['nama_rekening']  ?? null,
            'rekening'       => $data['rekening']       ?? null,
            'nama_bank'      => $data['nama_bank']      ?? null,
        ];

        if (isset($data['password']) && $data['password'] !== '') {
            $payload['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        $payload = array_filter($payload, fn($v) => $v !== null);

        if (!$this->userModel->update($id, $payload)) {
            return $this->failValidationErrors($this->userModel->errors());
        }

        if (isset($data['alamat'])) {
            $db = \Config\Database::connect();
            $db->table('orders')
                ->where('agen_id', $id)
                ->set(['note' => $data['alamat']])
                ->update();
        }

        $updated = $this->userModel
            ->select('id, name, email, role, no_telp, alamat, nama_rekening, rekening, nama_bank, created_at')
            ->find($id);

        return $this->respond([
            'message' => 'User berhasil diupdate',
            'data'    => $updated
        ], ResponseInterface::HTTP_OK);
    }

    public function setActive($id = null)
    {
        if (!$this->userModel->find($id)) {
            return $this->failNotFound('User tidak ditemukan');
        }

        $data = $this->request->getJSON(true);

        if (!is_array($data) || !array_key_exists('is_active', $data)) {
            return $this->failValidationErrors('is_active wajib diisi');
        }

        $payload = ['is_active' => (int) $data['is_active']];

        if (!$this->userModel->update($id, $payload)) {
            return $this->failServerError('Gagal memperbarui status aktif.');
        }

        $updated = $this->userModel
            ->select('id, name, email, role, is_active')
            ->find($id);

        return $this->respond([
            'message' => 'Status aktif user diperbarui',
            'data'    => $updated,
        ]);
    }

    public function delete($id = null)
    {
        if (!$this->userModel->find($id)) {
            return $this->failNotFound('User tidak ditemukan');
        }

        $this->userModel->delete($id);
        return $this->respondDeleted(['message' => 'User berhasil dihapus']);
    }
}
