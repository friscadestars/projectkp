<?php namespace App\Models;

use CodeIgniter\Model;

class InvoiceModel extends Model
{
    protected $table = 'invoices';
    protected $primaryKey = 'id';
    protected $allowedFields = ['order_id', 'total_amount', 'invoice_date'];
    protected $useTimestamps = true;

}
