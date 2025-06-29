<?php namespace App\Controllers;

use App\Models\ShipmentModel;
use App\Models\OrderModel;
use CodeIgniter\Controller;

class ShipmentController extends Controller
{
    public function index()
    {
        $shipmentModel = new ShipmentModel();
        $data['shipments'] = $shipmentModel->findAll();
        return view('shipments/index', $data);
    }

    public function create()
    {
        $orderModel = new OrderModel();
        $data['orders'] = $orderModel->findAll();
        return view('shipments/create', $data);
    }

    public function store()
    {
        $model = new ShipmentModel();
        $model->save([
            'order_id'     => $this->request->getPost('order_id'),
            'shipped_date' => $this->request->getPost('shipped_date'),
            'status'       => $this->request->getPost('status'),
        ]);
        return redirect()->to('/shipments');
    }

    public function edit($id)
    {
        $shipmentModel = new ShipmentModel();
        $orderModel = new OrderModel();
        $data['shipment'] = $shipmentModel->find($id);
        $data['orders'] = $orderModel->findAll();
        return view('shipments/edit', $data);
    }

    public function update($id)
    {
        $model = new ShipmentModel();
        $model->update($id, [
            'order_id'     => $this->request->getPost('order_id'),
            'shipped_date' => $this->request->getPost('shipped_date'),
            'status'       => $this->request->getPost('status'),
        ]);
        return redirect()->to('/shipments');
    }

    public function delete($id)
    {
        $model = new ShipmentModel();
        $model->delete($id);
        return redirect()->to('/shipments');
    }
}
