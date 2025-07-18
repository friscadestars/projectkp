<?php

namespace App\Models;

use CodeIgniter\Model;

class InvoiceModel extends Model
{
    protected $table            = 'invoices';
    protected $primaryKey       = 'id';
    protected $allowedFields    = [
        'order_item_id',
        'invoice_number',
        'invoice_date',
        'due_date',
        'amount_total',
        'tax_amount',
        'status',
        'payment_date',
        'payment_method',
        'notes',
        'created_at',
        'updated_at',
    ];
    protected $useTimestamps = true;
}
