<?php

namespace App\Controllers;

use App\Models\DistributorPabrikModel;
use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class DistributorPabrikController extends ResourceController
{
    protected $format = 'json';

    public function show($distributorId = null)
    {
        if (!$distributorId) {
            return $this->failValidationErrors("Distributor ID diperlukan.");
        }

        $model = new DistributorPabrikModel();

        $row = $model->where('distributor_id', $distributorId)->first();

        if (!$row) {
            return $this->failNotFound("Pabrik tidak ditemukan untuk distributor ID: $distributorId");
        }

        $userModel   = new UserModel();
        $pabrik = $userModel->find($row['pabrik_id']);

        if (!$pabrik) {
            return $this->failNotFound("Data user untuk pabrik dengan ID {$row['pabrik_id']} tidak ditemukan.");
        }

        return $this->respond([
            'distributor_id' => $distributorId,
            'pabrik_id'      => $pabrik['id'],
            'name'           => $pabrik['name'],
            'email'          => $pabrik['email']
        ]);
    }

    public function distributorsByPabrik($pabrikId = null)
    {
        if (!$pabrikId) {
            return $this->failValidationErrors("Pabrik ID diperlukan.");
        }

        $adModel = new DistributorPabrikModel();
        $rows    = $adModel->where('pabrik_id', (int) $pabrikId)->findAll();

        if (!$rows) {
            return $this->respond([]);
        }

        $distributorIds = array_map('intval', array_column($rows, 'distributor_id'));

        $userModel = new UserModel();
        $distributors = $userModel
            ->select('id, name, email, no_telp, rekening, nama_rekening, nama_bank, alamat, is_active')
            ->whereIn('id', $distributorIds)
            ->where('role', 'distributor')
            ->findAll();

        $db        = \Config\Database::connect();
        $lastRows  = $db->table('orders')
            ->select('distributor_id, MAX(order_date) AS last_order_date')
            ->whereIn('distributor_id', $distributorIds)
            ->groupBy('distributor_id')
            ->get()
            ->getResultArray();

        $lastOrderMap = [];
        foreach ($lastRows as $r) {
            $lastOrderMap[(int) $r['distributor_id']] = $r['last_order_date'];
        }

        foreach ($distributors as &$a) {
            $a['last_order_date'] = $lastOrderMap[(int) $a['id']] ?? null;
        }

        return $this->respond($distributors);
    }
}
