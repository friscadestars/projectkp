<?php

namespace App\Controllers;

use App\Models\InvoiceModel;
use CodeIgniter\RESTful\ResourceController;

class InvoiceController extends ResourceController
{
    protected $modelName = 'App\Models\InvoiceModel';
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $invoice = $this->model->find($id);
        if (!$invoice) {
            return $this->failNotFound('Invoice tidak ditemukan');
        }
        return $this->respond($invoice);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!isset($data['agen_id']) || !isset($data['distributor_id'])) {
            return $this->failValidationErrors('Agen ID dan Distributor ID wajib diisi');
        }

        $db = \Config\Database::connect();
        $builder = $db->table('users');
        $builder->where('id', $data['agen_id']);
        $builder->where('created_by', $data['distributor_id']); // agen milik distributor

        $agent = $builder->get()->getRow();

        if (!$agent) {
            return $this->fail('Agen tidak valid atau bukan milik distributor ini');
        }

        // Simpan invoice (jangan hapus order_id, hanya order_item_ids saja yang dihapus)
        $invoiceData = $data;
        unset($invoiceData['order_item_ids']); // hanya hilangkan order_item_ids

        // Validasi jika order_id tidak disertakan
        if (!isset($invoiceData['order_id'])) {
            return $this->failValidationErrors('Order ID wajib disertakan');
        }

        if (!$this->model->insert($invoiceData)) {
            return $this->failValidationErrors($this->model->errors());
        }

        $invoiceId = $this->model->getInsertID();

        // Simpan ke invoice_items
        if (!empty($data['order_item_ids'])) {
            $invoiceItems = [];
            $orderItemsTable = $db->table('order_items');
            $selectedItems = $orderItemsTable
                ->whereIn('id', $data['order_item_ids'])
                ->get()
                ->getResultArray();

            foreach ($selectedItems as $item) {
                $invoiceItems[] = [
                    'invoice_id'    => $invoiceId,
                    'order_item_id' => $item['id'],
                    'quantity'      => $item['quantity'],
                    'unit_price'    => $item['unit_price'],
                ];
            }

            if (!empty($invoiceItems)) {
                $db->table('invoice_items')->insertBatch($invoiceItems);
            }
        }

        return $this->respondCreated([
            'message' => 'Invoice berhasil dibuat beserta itemnya',
            'id' => $invoiceId
        ]);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        return $this->respond([
            'message' => 'Invoice berhasil diperbarui'
        ]);
    }

    public function delete($id = null)
    {
        if (!$this->model->find($id)) {
            return $this->failNotFound('Invoice tidak ditemukan');
        }

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Invoice berhasil dihapus']);
    }

    public function getByAgent($agentId = null)
    {
        if ($agentId === null) {
            return $this->fail('agentId diperlukan');
        }

        $invoices = $this->model->where('agen_id', $agentId)->findAll();
        return $this->respond($invoices);
    }

    public function confirmPayment($id = null)
    {
        if (!$id) {
            return $this->fail('ID invoice tidak ditemukan');
        }

        $invoice = $this->model->find($id);
        if (!$invoice) {
            return $this->failNotFound('Invoice tidak ditemukan');
        }

        $this->model->update($id, ['status' => 'Lunas']);

        return $this->respond([
            'message' => 'Pembayaran berhasil dikonfirmasi',
            'invoice_id' => $id,
            'status' => 'Lunas'
        ]);
    }
}
