<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateOrdersTable extends Migration
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
            'agen_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => false
            ],
            'distributor_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true
            ],
            'pabrik_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'approved'],
                'default'    => 'pending',
                'null'       => false
            ],
            'order_date' => [
                'type' => 'DATETIME',
                'null' => false
            ],
            'delivery_date' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'resi' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true
            ],
            'accepted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'note' => [
                'type' => 'TEXT',
                'null' => true
            ]
        ]);

        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('agen_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('distributor_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('pabrik_id', 'users', 'id', 'CASCADE', 'CASCADE');

        $this->forge->createTable('orders');
    }

    public function down()
    {
        $this->forge->dropTable('orders');
    }
}
