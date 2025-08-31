<?php

namespace App\Controllers;

use App\Models\InvoiceModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use App\Models\OrderModel;
use App\Models\UserModel;


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
            ->select('invoice_items.*, order_items.product_name as name, pp.harga as unitPrice')
            ->join('order_items', 'order_items.id = invoice_items.order_item_id')
            ->join('product_prices pp', 'pp.kode_produk = order_items.kode_produk AND pp.role = "pabrik"', 'left')
            ->where('invoice_items.invoice_id', $id)
            ->get()
            ->getResultArray();

        // Ambil order
        $order = $db->table('orders o')
            ->select('o.*, u.name as agen_name')
            ->join('users u', 'u.id = o.agen_id', 'left')
            ->where('o.id', $invoice['order_id'])
            ->get()
            ->getRowArray();


        $pengirimId = $invoice['pabrik_id'] ?? $invoice['distributor_id'];

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
            'pengirim_bank' => $pengirim,
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

        $invoiceData['invoice_date'] = date('Y-m-d H:i:s');
        if (!$this->model->insert($invoiceData)) {
            return $this->failValidationErrors($this->model->errors());
        }

        $invoiceId = $this->model->getInsertID();

        $notifModel = new \App\Models\NotificationModel();
        $orderModel = new \App\Models\OrderModel();
        $userModel = new \App\Models\UserModel();

        $order = $orderModel->find($invoiceData['order_id']);
        $agenId = $invoiceData['agen_id'] ?? $order['agen_id'] ?? null;

        if ($agenId) {
            $agen = $userModel->find($agenId);
            $notifModel->insert([
                'user_id'    => $agenId,
                'title'      => 'Tagihan Baru Diterbitkan',
                'message'    => 'Tagihan baru telah dibuat untuk pesanan Anda.',
                'type'       => 'invoice_created',
                'is_read'    => 0,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        }

        $distributorId = $invoiceData['distributor_id'] ?? $order['distributor_id'] ?? null;

        if ($distributorId) {
            $notifModel->insert([
                'user_id'    => $distributorId,
                'title'      => 'Invoice Diterbitkan untuk Agen Anda',
                'message'    => 'Invoice untuk agen telah dibuat dan siap dibayar.',
                'type'       => 'invoice_created_distributor',
                'is_read'    => 0,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        }

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
                    // 'unit_price'    => $hargaPabrik,
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

    public function getByAgent()
    {
        $user = $this->getUserFromToken();
        if (!$user || !isset($user['id'])) {
            return $this->failUnauthorized('User tidak terautentikasi');
        }

        $agentId = $user['id'];

        $db = \Config\Database::connect();
        $invoices = $db->table('invoices i')
            ->select('
            i.id, 
            i.invoice_number, 
            i.invoice_date, 
            i.amount_total, 
            i.status, 
            i.order_id, 
            o.order_code, 
            o.order_date
        ')
            ->join('orders o', 'o.id = i.order_id', 'left')
            ->where('i.agen_id', $agentId)
            ->orderBy('i.invoice_date', 'DESC')
            ->get()
            ->getResultArray();

        return $this->respond([
            'status' => 'success',
            'invoices' => $invoices
        ]);
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
            'status' => 'waiting_confirmation',
            'payment_date' => date('Y-m-d H:i:s'), // Opsional: catat waktu pembayaran
        ];

        $this->model->update($id, $data);

        // Ambil data invoice dan order setelah update
        $invoice = $this->model->find($id);

        $orderModel = new \App\Models\OrderModel();
        $order = $orderModel->find($invoice['order_id'] ?? 0);

        $notifModel = new \App\Models\NotificationModel();
        $userModel = new \App\Models\UserModel();

        $agenId = $invoice['agen_id'] ?? $order['agen_id'] ?? null;

        // Notifikasi ke agen bahwa pembayaran diterima
        if ($agenId) {
            $notifModel->insert([
                'user_id'    => $agenId,
                'title'      => 'Pembayaran Dikonfirmasi',
                'message'    => 'Pembayaran Anda telah dikonfirmasi. Status tagihan: Menunggu Validasi.',
                'type'       => 'invoice_paid',
                'is_read'    => 0,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        }

        if ($agenId) {
            $notifModel->insert([
                'user_id'    => $agenId,
                'title'      => 'Validasi Pembayaran',
                'message'    => 'Pembayaran Anda telah divalidasi. Status tagihan: Lunas.',
                'type'       => 'invoice_paid',
                'is_read'    => 0,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        }

        $distributorId = $invoice['distributor_id'] ?? $order['distributor_id'] ?? null;

        if ($distributorId) {
            $notifModel->insert([
                'user_id'    => $distributorId,
                'title'      => 'Pembayaran Tagihan Diterima',
                'message'    => 'Silahkan lakukan validasi pembayaran untuk' .  $agenId . '.',
                'type'       => 'invoice_paid_distributor',
                'is_read'    => 0,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        }

        return $this->respond([
            'message' => 'Pembayaran berhasil dikonfirmasi',
            'invoice_id' => $id,
            'status' => 'waiting_confirmation'
        ]);
    }

    public function getByDistributor($id)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('invoices i');
        $builder->select('
    i.*,
    o.order_code as orderCode,
    o.status as order_status,
    i.status as invoice_status,
    o.order_date,
    o.accepted_at as receivedDate,
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

    public function createInvoiceForDistributor()
    {
        $distributorId = $this->request->getPost('distributor_id');
        $orderId = $this->request->getPost('order_id');
        $totalAmount = $this->request->getPost('total_amount');

        if (!$distributorId || !$orderId || !$totalAmount) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Semua data wajib diisi.'
            ]);
        }

        $invoiceModel = new \App\Models\InvoiceModel();
        $notifModel = new \App\Models\NotificationModel();

        $data = [
            'order_id'       => $orderId,
            'distributor_id' => $distributorId,
            'amount_total'   => $totalAmount,
            'status'         => 'unpaid',
            'role'           => 'pabrik',
            'created_at'     => date('Y-m-d H:i:s'),
        ];

        if ($invoiceModel->insert($data)) {
            $notifModel->insert([
                'user_id'    => $distributorId,
                'title'      => 'Tagihan Baru dari Pabrik',
                'message'    => 'Anda menerima tagihan baru dari pabrik untuk pesanan ' . $orderId . '.',
                'type'       => 'invoice_from_pabrik',
                'is_read'    => 0,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'Invoice dari pabrik ke distributor berhasil dibuat.'
            ]);
        } else {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Gagal membuat invoice.',
                'errors' => $invoiceModel->errors()
            ]);
        }
    }

    public function getDistributorInvoices($distributorId = null)
    {
        if (!$distributorId) {
            return $this->fail('ID distributor diperlukan');
        }

        $db = \Config\Database::connect();
        $builder = $db->table('invoices i');

        $builder->select('
        i.id as invoice_id,
        i.invoice_number,
        i.invoice_date,
        i.amount_total,
        i.status,
        i.order_id,
        o.order_code,
        o.order_date,
        o.agen_id,
        agen.name as agen_name,
        pabrik.name as pabrik_name
    ');
        $builder->join('orders o', 'o.id = i.order_id', 'left');
        $builder->join('users agen', 'agen.id = o.agen_id', 'left');
        $builder->join('users pabrik', 'pabrik.id = o.pabrik_id', 'left');

        $builder->where('i.role', 'pabrik');
        $builder->where('o.distributor_id', $distributorId);
        $builder->orderBy('i.invoice_date', 'DESC');

        $query = $builder->get();

        return $this->respond([
            'status' => 'success',
            'invoices' => $query->getResultArray()
        ]);
    }

    public function konfirmasi_pembayaran($id = null)
    {
        if (!$id) {
            return $this->fail('ID invoice tidak ditemukan');
        }

        $data = $this->request->getJSON(true);
        $status = strtolower($data['status'] ?? '');

        if (!in_array($status, ['paid', 'unpaid'])) {
            return $this->failValidationErrors('Status tidak valid');
        }

        $updateData = ['status' => $status];

        if ($status === 'paid') {
            $updateData['payment_date'] = date('Y-m-d H:i:s');
        }

        $invoiceModel = new \App\Models\InvoiceModel();
        $updated = $invoiceModel->update($id, $updateData);

        if ($updated) {
            if ($status === 'paid') {
                $invoice = $invoiceModel->find($id);

                $orderModel = new \App\Models\OrderModel();
                $order = $orderModel->find($invoice['order_id'] ?? 0);

                $notifModel = new \App\Models\NotificationModel();
                $userModel = new \App\Models\UserModel();

                $agenId = $invoice['agen_id'] ?? $order['agen_id'] ?? null;
                $distributorId = $invoice['distributor_id'] ?? $order['distributor_id'] ?? null;

                if ($agenId) {
                    $notifModel->insert([
                        'user_id'    => $agenId,
                        'title'      => 'Pembayaran Dikonfirmasi',
                        'message'    => 'Pembayaran Anda telah dikonfirmasi. Status tagihan anda sudah Lunas.',
                        'type'       => 'invoice_paid',
                        'is_read'    => 0,
                        'created_at' => date('Y-m-d H:i:s'),
                    ]);
                }

                if ($distributorId) {
                    $notifModel->insert([
                        'user_id'    => $distributorId,
                        'title'      => 'Pembayaran Tagihan Diterima',
                        'message'    => 'Pembayaran tagihan anda telah dikonfirmasi. Tagihan sudah lunas.',
                        'type'       => 'invoice_paid_distributor',
                        'is_read'    => 0,
                        'created_at' => date('Y-m-d H:i:s'),
                    ]);
                }
            }

            return $this->respond([
                'message' => 'Status pembayaran berhasil diperbarui',
                'invoice_id' => $id,
                'status' => $status
            ]);
        } else {
            return $this->failServerError('Gagal memperbarui status pembayaran');
        }
    }

    public function generateInvoiceNumber($role = 'distributor', $userId = null)
    {
        $model = new \App\Models\InvoiceModel();

        if (!$userId) {
            return $this->fail('ID user tidak diberikan.');
        }

        switch ($role) {
            case 'distributor':
                $prefix = "INV/" . date('Ymd') . "/";
                $filterField = 'distributor_id';
                $extraWhere = ['agen_id IS NOT NULL']; // tetap pakai filter untuk distributor
                break;
            case 'pabrik':
                $prefix = "INVPBR/" . date('Ymd') . "/";
                $filterField = 'pabrik_id';
                $extraWhere = [];
                break;
            case 'agen':
                $prefix = "INV/" . date('Ymd') . "/";
                $filterField = 'agen_id';
                $extraWhere = [];
                break;
            default:
                return $this->fail('Role invoice tidak valid.');
        }

        $builder = $model->where($filterField, intval($userId));

        foreach ($extraWhere as $cond) {
            $builder->where($cond);
        }

        // Ambil invoice terakhir
        $lastInvoice = $builder
            ->orderBy('id', 'DESC')
            ->first();

        $lastNumber = 0;
        if ($lastInvoice) {
            $parts = explode('/', $lastInvoice['invoice_number']);
            $lastNumber = intval(end($parts));
        }

        $number = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        $invoiceNumber = $prefix . $number;

        return $this->respond(['invoice_number' => $invoiceNumber]);
    }

    public function checkInvoiceByOrder($orderId)
    {
        $invoiceModel = new \App\Models\InvoiceModel();
        $invoice = $invoiceModel
            ->where('order_id', $orderId)
            ->where('pabrik_id !=', null)
            ->first();

        if (!$invoice) {
            return $this->respond([
                'exists' => false,
                'order_id' => $orderId
            ]);
        }

        return $this->respond([
            'exists' => true,
            'order_id' => $invoice['order_id'],
            'invoice_number' => $invoice['invoice_number'],
            'id' => $invoice['id'],
            'status' => $invoice['status'],
            'pabrik_id' => $invoice['pabrik_id'],
        ]);
    }

    public function createInvoiceForPabrik()
    {
        $data = $this->request->getJSON(true);

        // Validasi input
        if (!isset($data['distributor_id'], $data['order_id'], $data['products'])) {
            return $this->failValidationErrors('Distributor ID, Order ID, dan Produk wajib diisi.');
        }

        $user = $this->getUserFromToken();
        if (!$user || !isset($user['id'])) {
            return $this->failUnauthorized('User tidak terautentikasi');
        }

        $invoiceModel = new \App\Models\InvoiceModel();
        $invoiceItemModel = new \App\Models\InvoiceItemModel();
        $notifModel = new \App\Models\NotificationModel();
        $orderModel = new \App\Models\OrderModel();

        $order = $orderModel->find($data['order_id']);
        if (!$order) {
            return $this->failNotFound('Order tidak ditemukan');
        }

        $pabrikId = $data['pabrik_id'] ?? $user['id'];

        // Hitung total
        $amountTotal = 0;
        foreach ($data['products'] as $p) {
            $amountTotal += ($p['quantity'] ?? 0) * ($p['unitPrice'] ?? 0);
        }

        // Ambil invoice terakhir pabrik dari database
        $lastInvoice = $invoiceModel
            ->where('pabrik_id', $pabrikId)
            ->like('invoice_number', 'INVPBR/', 'after') // pastikan hanya cari prefix INVPBR/
            ->orderBy('id', 'DESC')
            ->first();

        $lastNumber = 0;
        if ($lastInvoice && !empty($lastInvoice['invoice_number'])) {
            $parts = explode('/', $lastInvoice['invoice_number']);
            $lastNumber = intval(end($parts));  // Ambil angka terakhir
        }

        $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        $invoiceNumber = "INVPBR/" . date('Ymd') . "/" . $nextNumber;

        // Simpan invoice
        $invoiceData = [
            'invoice_number' => $invoiceNumber,
            'order_id'       => $data['order_id'],
            'pabrik_id'      => $pabrikId,
            'distributor_id' => $data['distributor_id'],
            'agen_id'        => null,
            'amount_total'   => $amountTotal,
            'status'         => 'unpaid',
            'invoice_date'   => $data['invoice_date'] ?? date('Y-m-d H:i:s'),
            'due_date'       => $data['due_date'] ?? null,
            'notes'          => $data['notes'] ?? null,
            'role'           => 'pabrik',
            'created_at'     => date('Y-m-d H:i:s'),
            'updated_at'     => date('Y-m-d H:i:s'),
        ];

        if (!$invoiceModel->insert($invoiceData)) {
            return $this->failValidationErrors($invoiceModel->errors());
        }

        $invoiceId = $invoiceModel->getInsertID();

        // Simpan invoice items
        foreach ($data['products'] as $p) {
            $invoiceItemModel->insert([
                'invoice_id'    => $invoiceId,
                'order_item_id' => $p['id'],
                'quantity'      => $p['quantity'],
                'unit_price'    => $p['unitPrice'],
            ]);
        }

        // Kirim notifikasi ke distributor
        $notifModel->insert([
            'user_id'    => $data['distributor_id'],
            'title'      => 'Tagihan Baru dari Pabrik',
            'message'    => 'Anda menerima tagihan baru dari pabrik untuk pesanan #' . $data['order_id'] . '.',
            'type'       => 'invoice_from_pabrik',
            'is_read'    => 0,
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        return $this->respondCreated([
            'message' => 'Invoice berhasil dibuat oleh pabrik',
            'invoice_id' => $invoiceId,
            'invoice_number' => $invoiceNumber
        ]);
    }

    // Approve pembayaran oleh distributor
    public function approve($id)
    {
        $invoiceModel = new \App\Models\InvoiceModel();
        $invoice = $invoiceModel->find($id);
        if (!$invoice) return $this->failNotFound('Invoice tidak ditemukan');

        $invoiceModel->update($id, [
            'status' => 'paid',
            'payment_date' => date('Y-m-d H:i:s')
        ]);

        return $this->respond([
            'message' => 'Pembayaran disetujui',
            'invoice_id' => $id,
            'status' => 'paid'
        ]);
    }

    // Reject pembayaran oleh distributor
    public function reject($id)
    {
        $invoiceModel = new \App\Models\InvoiceModel();
        $invoice = $invoiceModel->find($id);
        if (!$invoice) return $this->failNotFound('Invoice tidak ditemukan');

        $invoiceModel->update($id, [
            'status' => 'unpaid',
            'payment_date' => null
        ]);

        return $this->respond([
            'message' => 'Pembayaran ditolak',
            'invoice_id' => $id,
            'status' => 'unpaid'
        ]);
    }
}
