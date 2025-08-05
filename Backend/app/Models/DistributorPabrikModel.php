<?php

namespace App\Models;

use CodeIgniter\Model;

class DistributorPabrikModel extends Model
{
    protected $table      = 'distributor_pabrik';
    protected $primaryKey = 'id';
    protected $allowedFields = ['distributor_id', 'pabrik_id', 'created_at'];
    public $timestamps = false;
}
