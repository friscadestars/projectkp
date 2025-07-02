<?php namespace App\Controllers;

use App\Models\OrderModel;
use App\Models\UserModel;
use CodeIgniter\Controller;

class OrderController extends Controller
{
   public function index()
    {
        $model = new OrderModel();
        $data['orders'] = $model->findAll();

        return view('orders/index', $data);
    }

    public function detail($id)
    {
        // ambil data order dan tampilkan
        echo "Detail untuk order ID: $id";
    }

    public function terima($id)
    {
        $model = new OrderModel();
        $model->update($id, ['status' => 'delivered']);

        return redirect()->to('/orders')->with('success', 'Order diterima.');
    }
}
