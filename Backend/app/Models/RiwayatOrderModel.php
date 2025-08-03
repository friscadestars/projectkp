<?php

namespace App\Models;

use CodeIgniter\Model;

class RiwayatOrderModel extends Model
{
    protected $table            = 'riwayat_orders';
    protected $primaryKey       = 'id';
    protected $allowedFields    = [
        'order_id',
        'order_code',
        'distributor',
        'tanggal_order',
        'tanggal_terima',
        'no_resi',
        'total_harga',
        'status_order',
        'created_at',
        'updated_at'
    ];
    protected $useTimestamps    = true;
}
