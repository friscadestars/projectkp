<?php namespace App\Controllers;

use App\Models\OrderModel;
use App\Models\UserModel;
use CodeIgniter\Controller;

class OrderController extends Controller
{
    public function index()
    {
        $orderModel = new OrderModel();
        $data['orders'] = $orderModel->findAll();
        return view('orders/index', $data);
    }

    public function create()
    {
        $userModel = new UserModel();
        $data['users'] = $userModel->findAll();
        return view('orders/create', $data);
    }

    public function store()
    {
        $model = new OrderModel();
        $model->save([
            'user_id' => $this->request->getPost('user_id'),
            'order_date' => $this->request->getPost('order_date'),
        ]);
        return redirect()->to('/orders');
    }

    public function edit($id)
    {
        $orderModel = new OrderModel();
        $userModel = new UserModel();
        $data['order'] = $orderModel->find($id);
        $data['users'] = $userModel->findAll();
        return view('orders/edit', $data);
    }

    public function update($id)
    {
        $model = new OrderModel();
        $model->update($id, [
            'user_id' => $this->request->getPost('user_id'),
            'order_date' => $this->request->getPost('order_date'),
        ]);
        return redirect()->to('/orders');
    }

    public function delete($id)
    {
        $model = new OrderModel();
        $model->delete($id);
        return redirect()->to('/orders');
    }
}
