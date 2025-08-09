<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderItemModel extends Model
{
    protected $table      = 'order_items';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'id',
        'order_id',
        'product_name',
        'kode_produk',
        'quantity',
        'unit_price',
        'address'
    ];

    protected $useTimestamps = false;
}
