<?php namespace App\Controllers;

use App\Models\InvoiceModel;
use App\Models\OrderModel;
use CodeIgniter\Controller;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoiceModel = new InvoiceModel();
        $data['invoices'] = $invoiceModel->findAll();
        return view('invoices/index', $data);
    }

    public function create()
    {
        $orderModel = new OrderModel();
        $data['orders'] = $orderModel->findAll();
        return view('invoices/create', $data);
    }

    public function store()
    {
        $model = new InvoiceModel();
        $model->save([
            'order_id'     => $this->request->getPost('order_id'),
            'total_amount' => $this->request->getPost('total_amount'),
            'invoice_date' => $this->request->getPost('invoice_date'),
        ]);
        return redirect()->to('/invoices');
    }

    public function edit($id)
    {
        $invoiceModel = new InvoiceModel();
        $orderModel = new OrderModel();
        $data['invoice'] = $invoiceModel->find($id);
        $data['orders'] = $orderModel->findAll();
        return view('invoices/edit', $data);
    }

    public function update($id)
    {
        $model = new InvoiceModel();
        $model->update($id, [
            'order_id'     => $this->request->getPost('order_id'),
            'total_amount' => $this->request->getPost('total_amount'),
            'invoice_date' => $this->request->getPost('invoice_date'),
        ]);
        return redirect()->to('/invoices');
    }

    public function delete($id)
    {
        $model = new InvoiceModel();
        $model->delete($id);
        return redirect()->to('/invoices');
    }
}
