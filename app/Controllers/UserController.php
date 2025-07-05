<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class UserController extends ResourceController
{
    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function index() // GET all
    {
        return $this->respond($this->userModel->findAll());
    }

    public function show($id = null) // GET single user
    {
        $data = $this->userModel->find($id);
        if (!$data) return $this->failNotFound('User tidak ditemukan');
        return $this->respond($data);
    }

    public function create() // POST
    {
        $data = $this->request->getJSON(true);
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $this->userModel->insert($data);
        return $this->respondCreated(['message' => 'User berhasil dibuat']);
    }

    public function update($id = null) // PUT
    {
        $data = $this->request->getJSON(true);
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        $this->userModel->update($id, $data);
        return $this->respond(['message' => 'User berhasil diupdate']);
    }

    public function delete($id = null) // DELETE
    {
        $this->userModel->delete($id);
        return $this->respondDeleted(['message' => 'User berhasil dihapus']);
    }
}
