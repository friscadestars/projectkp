<?php

namespace App\Controllers;

use App\Models\InvoiceModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;

class InvoiceController extends ResourceController
{
    protected $modelName = 'App\Models\InvoiceModel';
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    private function getUserFromToken()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return null;
        }

        $token = $matches[1];
        $secretKey = getenv('JWT_SECRET') ?: 'default_key';

        try {
            $decoded = JWT::decode($token, new \Firebase\JWT\Key($secretKey, 'HS256'));
            return (array) $decoded->data;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function show($id = null)
    {
        $invoice = $this->model->find($id);
        if (!$invoice) {
            return $this->failNotFound('Invoice tidak ditemukan');
        }

        // Ambil user login dari session (misalnya pakai JWT atau session CI4)
        $user = $this->getUserFromToken();
        if (!$user || !isset($user['id'])) {
            return $this->failUnauthorized('User tidak terautentikasi');
        }

        $loggedAgenId = $user['id'];

        // Validasi apakah invoice ini milik agen yang login
        if (
            $invoice['agen_id'] != $loggedAgenId &&
            $invoice['distributor_id'] != $loggedAgenId &&
            $invoice['pabrik_id'] != $loggedAgenId
        ) {
            return $this->fail('Anda tidak memiliki akses ke invoice ini');
        }

        $db = \Config\Database::connect();

        // Ambil invoice_items dan join ke order_items
        $items = $db->table('invoice_items')
            ->select('invoice_items.*, order_items.product_name as nama, order_items.quantity as jumlah, order_items.unit_price as harga')
            ->join('order_items', 'order_items.id = invoice_items.order_item_id')
            ->where('invoice_items.invoice_id', $id)
            ->get()
            ->getResultArray();

        // Ambil order
        $order = $db->table('orders')->where('id', $invoice['order_id'])->get()->getRowArray();

        $pengirimId = $invoice['distributor_id'] ?? $invoice['pabrik_id'];

        $pengirim = null;
        if ($pengirimId) {
            $pengirim = $db->table('users')
                ->select('nama_bank, nama_rekening, rekening')
                ->where('id', $pengirimId)
                ->get()
                ->getRowArray();
        }

        // Masukkan ke invoice agar bisa dibaca frontend
        $invoice['pengirim_bank'] = $pengirim;

        return $this->respond([
            'invoice' => $invoice,
            'items' => $items,
            'order' => $order,
        ]);
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

        $db = \Config\Database::connect();

        $invoices = $db->table('invoices i')
            ->select('i.id, i.invoice_number, i.invoice_date, i.amount_total, i.status, i.order_id, o.order_code, o.order_date')
            ->join('orders o', 'o.id = i.order_id', 'left')
            ->where('i.agen_id', $agentId)
            ->get()
            ->getResultArray();

        return $this->respond($invoices);
    }

    public function confirmPayment($id = null)
    {
        // Pastikan ID invoice ada
        if (!$id) {
            return $this->fail('ID invoice tidak ditemukan');
        }

        // Cari invoice berdasarkan ID
        $invoice = $this->model->find($id);
        if (!$invoice) {
            return $this->failNotFound('Invoice tidak ditemukan');
        }

        // Perbarui status invoice di database menjadi 'paid'
        $data = [
            'status' => 'paid',
            'payment_date' => date('Y-m-d H:i:s'), // Opsional: catat waktu pembayaran
        ];

        $this->model->update($id, $data);

        // Kirim respons sukses. Status di database adalah 'paid'.
        // Anda bisa mengirimkan pesan yang lebih deskriptif untuk frontend.
        return $this->respond([
            'message' => 'Pembayaran berhasil dikonfirmasi',
            'invoice_id' => $id,
            'status' => 'paid' // Kirim status database yang sebenarnya
        ]);
    }

    public function getByDistributor($id)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('invoices i');
        $builder->select('
        i.*,
        o.order_code as orderCode,
        o.status,
        o.order_date,
        COALESCE(u.name, u_order.name) as agenName,
        u2.name as pabrikName
    ');
        $builder->join('orders o', 'o.id = i.order_id', 'left');
        $builder->join('users u', 'u.id = i.agen_id', 'left');
        $builder->join('users u_order', 'u_order.id = o.agen_id', 'left');
        $builder->join('users u2', 'u2.id = i.pabrik_id', 'left');

        $builder->where('i.distributor_id', $id);
        $builder->groupStart()
            ->where('i.agen_id', null)
            ->orWhere('i.agen_id', 20)
            ->groupEnd();

        $query = $builder->get();
        return $this->respond($query->getResult());
    }
}
