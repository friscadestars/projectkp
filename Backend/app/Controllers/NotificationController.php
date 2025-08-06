<?php

namespace App\Controllers;

use App\Models\NotificationModel;
use CodeIgniter\RESTful\ResourceController;

class NotificationController extends ResourceController
{
    protected $modelName = NotificationModel::class;
    protected $format    = 'json';

    // GET all notifications or by user_id
    public function index()
    {
        $userId = $this->request->getGet('user_id');

        if ($userId) {
            return $this->respond(
                $this->model->where('user_id', $userId)->orderBy('created_at', 'DESC')->findAll()
            );
        }

        return $this->respond($this->model->findAll());
    }

    // POST new notification
    public function create()
    {
        $data = $this->request->getJSON(true);

        if ($this->model->insert($data)) {
            return $this->respondCreated(['message' => 'Notifikasi berhasil ditambahkan']);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // PUT/PATCH mark as read
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (!isset($data['is_read'])) {
            return $this->failValidationErrors('Kolom is_read wajib diisi');
        }

        $updateData = [
            'is_read' => (int) $data['is_read'],
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        if ($this->model->update($id, $updateData)) {
            return $this->respond(['message' => 'Notifikasi diperbarui']);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // DELETE
    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Notifikasi dihapus']);
        }

        return $this->failNotFound('Notifikasi tidak ditemukan');
    }
}
