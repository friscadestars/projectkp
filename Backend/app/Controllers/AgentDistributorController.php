<?php

namespace App\Controllers;

use App\Models\AgentDistributorModel;
use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class AgentDistributorController extends ResourceController
{
    protected $format = 'json';

    public function show($agentId = null)
    {
        if (!$agentId) {
            return $this->failValidationErrors("Agent ID diperlukan.");
        }

        $model = new AgentDistributorModel();

        $row = $model->where('agent_id', $agentId)->first();

        if (!$row) {
            return $this->failNotFound("Distributor tidak ditemukan untuk agent ID: $agentId");
        }

        $userModel   = new UserModel();
        $distributor = $userModel->find($row['distributor_id']);

        if (!$distributor) {
            return $this->failNotFound("Data user untuk distributor dengan ID {$row['distributor_id']} tidak ditemukan.");
        }

        return $this->respond([
            'agent_id'       => $agentId,
            'distributor_id' => $distributor['id'],
            'name'           => $distributor['name'],
            'email'          => $distributor['email']
        ]);
    }

    public function agentsByDistributor($distributorId = null)
    {
        if (!$distributorId) {
            return $this->failValidationErrors("Distributor ID diperlukan.");
        }

        $adModel = new AgentDistributorModel();
        $rows    = $adModel->where('distributor_id', (int) $distributorId)->findAll();

        if (!$rows) {
            return $this->respond([]); // tidak ada agen untuk distributor ini
        }

        $agentIds = array_map('intval', array_column($rows, 'agent_id'));

        // Ambil data agen dari tabel users
        $userModel = new UserModel();
        $agents    = $userModel
            ->whereIn('id', $agentIds)
            ->where('role', 'agen')
            ->findAll();

        // Ambil tanggal order terakhir per agen dari tabel orders
        $db        = \Config\Database::connect();
        $lastRows  = $db->table('orders')
            ->select('agen_id, MAX(order_date) AS last_order_date')
            ->whereIn('agen_id', $agentIds)
            ->groupBy('agen_id')
            ->get()
            ->getResultArray();

        // Map: agen_id -> last_order_date
        $lastOrderMap = [];
        foreach ($lastRows as $r) {
            $lastOrderMap[(int) $r['agen_id']] = $r['last_order_date'];
        }

        // Sisipkan last_order_date ke tiap agen
        foreach ($agents as &$a) {
            $a['last_order_date'] = $lastOrderMap[(int) $a['id']] ?? null;
        }

        return $this->respond($agents);
    }
}
