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

        // Cari data relasi agent → distributor
        $row = $model->where('agent_id', $agentId)->first();

        if (!$row) {
            return $this->failNotFound("Distributor tidak ditemukan untuk agent ID: $agentId");
        }

        // Ambil info distributor dari tabel users
        $userModel = new UserModel();
        $distributor = $userModel->find($row['distributor_id']);

        if (!$distributor) {
            return $this->failNotFound("Data user untuk distributor dengan ID {$row['distributor_id']} tidak ditemukan.");
        }

        return $this->respond([
            'agent_id'       => $agentId,
            'distributor_id' => $distributor['id'], // <-- penting
            'name'           => $distributor['name'],
            'email'          => $distributor['email']
        ]);
    }
}
