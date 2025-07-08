<?php

namespace App\Models;

use CodeIgniter\Model;

class ShipmentModel extends Model
{
    protected $table            = 'shipments';
    protected $primaryKey       = 'id';
    protected $allowedFields    = [
        'order_id',
        'shipping_date',
        'estimated_delivery',
        'delivery_status',
        'tracking_number',
        'carrier',
        'shipping_address',
        'shipping_cost',
        'notes',
        'created_at',
        'updated_at',
    ];
    protected $useTimestamps = true;
}
