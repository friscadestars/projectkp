<?php

namespace App\Controllers;

use App\Models\OrderItemModel;
use CodeIgniter\RESTful\ResourceController;

class OrderItemController extends ResourceController
{
    protected $modelName = OrderItemModel::class;
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) return $this->failNotFound('Item not found');
        return $this->respond($data);
    }

    public function create()
    {
        $data = $this->request->getPost();
        if (!$this->model->insert($data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        return $this->respondCreated(['message' => 'Order item created']);
    }

    public function update($id = null)
    {
        $data = $this->request->getRawInput();
        if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        return $this->respond(['message' => 'Order item updated']);
    }

    public function delete($id = null)
    {
        if (!$this->model->find($id)) return $this->failNotFound('Item not found');
        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Order item deleted']);
    }
}
