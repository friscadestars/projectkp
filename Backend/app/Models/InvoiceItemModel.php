<?php

namespace App\Models;

use CodeIgniter\Model;

class InvoiceItemModel extends Model
{
    protected $table = 'invoice_items';
    protected $allowedFields = ['invoice_id', 'order_item_id', 'quantity', 'unit_price'];
    public $timestamps = false;
}
