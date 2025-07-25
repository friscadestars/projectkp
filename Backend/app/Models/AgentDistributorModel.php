<?php

namespace App\Models;

use CodeIgniter\Model;

class AgentDistributorModel extends Model
{
    protected $table      = 'agent_distributor';
    protected $primaryKey = 'id';
    protected $allowedFields = ['agent_id', 'distributor_id', 'created_at'];
    public $timestamps = false;
}
