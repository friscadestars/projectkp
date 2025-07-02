<?php

namespace App\Models;

use CodeIgniter\Model;

class ProductPriceModel extends Model
{
    protected $table = 'product_prices';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'nama_produk',
        'kode_produk',
        'harga',
        'role',
        'created_at',
        'updated_at'
    ];

    protected $useTimestamps = true; // otomatis isi created_at & updated_at
}
