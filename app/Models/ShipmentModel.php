<?php namespace App\Models;

use CodeIgniter\Model;

class ShipmentModel extends Model
{
    protected $table = 'shipments';
    protected $primaryKey = 'id';
    protected $allowedFields = ['order_id', 'shipped_date', 'status'];
}
