<?php namespace App\Models;

use CodeIgniter\Model;

class OrderModel extends Model
{
    protected $table = 'orders';
    protected $primaryKey = 'id';
    protected $allowedFields = ['agen_id', 'distributor_id', 'pabrik_id', 'status', 'order_date', 'delivery_date'];
}
