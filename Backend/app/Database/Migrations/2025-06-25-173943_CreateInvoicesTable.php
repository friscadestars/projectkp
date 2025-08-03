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
                'constraint' => ['unpaid', 'paid', 'overdue', 'cancelled'],
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
            ],
            'agen_id' => [
                'type'     => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null'     => true
            ],
            'distributor_id' => [
                'type'     => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null'     => true
            ],
            'order_id' => [
                'type'     => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null'     => true
            ],
            'pabrik_id' => [
                'type'     => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null'     => true
            ]
        ]);

        $this->forge->addPrimaryKey('id');
        $this->forge->addUniqueKey('invoice_number');

        // Tambahkan foreign key jika relasi sudah ada (optional, tergantung kebutuhan)
        $this->forge->addForeignKey('agen_id', 'users', 'id', 'SET NULL', 'CASCADE');
        $this->forge->addForeignKey('distributor_id', 'users', 'id', 'SET NULL', 'CASCADE');
        $this->forge->addForeignKey('order_id', 'orders', 'id', 'SET NULL', 'CASCADE');
        $this->forge->addForeignKey('pabrik_id', 'users', 'id', 'SET NULL', 'CASCADE');

        $this->forge->createTable('invoices');

        // Index tambahan (opsional untuk performa query)
        $this->db->query('CREATE INDEX invoices_order_id_idx ON invoices(order_id)');
        $this->db->query('CREATE INDEX invoices_status_idx ON invoices(status)');
        $this->db->query('CREATE INDEX invoices_distributor_id_idx ON invoices(distributor_id)');
        $this->db->query('CREATE INDEX invoices_agen_id_idx ON invoices(agen_id)');
    }

    public function down()
    {
        $this->forge->dropTable('invoices', true);
    }
}
