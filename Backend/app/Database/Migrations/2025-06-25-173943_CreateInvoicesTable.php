<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateInvoicesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true
            ],
            'order_item_id' => [ // Ganti dari order_id ke order_item_id
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => false
            ],
            'invoice_number' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => false
            ],
            'invoice_date' => [
                'type' => 'DATE',
                'null' => false
            ],
            'due_date' => [
                'type' => 'DATE',
                'null' => false
            ],
            'amount_total' => [
                'type'       => 'DECIMAL',
                'constraint' => '12,2',
                'null'       => false
            ],
            'tax_amount' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => false,
                'default'    => '0.00'
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['draft', 'unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled'],
                'default'    => 'draft',
                'null'       => false
            ],
            'payment_date' => [
                'type' => 'DATE',
                'null' => true
            ],
            'payment_method' => [
                'type'       => 'ENUM',
                'constraint' => ['cash', 'transfer', 'credit_card', 'e_wallet'],
                'null'       => true
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);

        $this->forge->addPrimaryKey('id');
        $this->forge->addUniqueKey('invoice_number');
        // Ubah foreign key menjadi ke order_items.id
        $this->forge->addForeignKey('order_item_id', 'order_items', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('invoices');

        // Buat index
        $this->db->query('CREATE INDEX invoices_order_item_id_idx ON invoices(order_item_id)');
        $this->db->query('CREATE INDEX invoices_status_idx ON invoices(status)');
    }

    public function down()
    {
        $this->forge->dropTable('invoices', true);
    }
}
