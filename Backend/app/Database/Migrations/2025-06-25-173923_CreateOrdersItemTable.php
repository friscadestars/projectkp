<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSimpleOrderItemsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [ // Primary Key
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'order_id' => [ // Foreign Key ke tabel orders
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => false,
            ],
            'product_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => false,
            ],
            'quantity' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => false,
                'default'    => 1,
            ],
            'unit_price' => [
                'type'       => 'DECIMAL',
                'constraint' => '12,2',
                'null'       => false,
            ],
            'address' => [
                'type'       => 'TEXT',
                'null'       => false,
            ],
        ]);

        $this->forge->addPrimaryKey('id');

        // Aktifkan foreign key ke orders
        $this->forge->addForeignKey('order_id', 'orders', 'id', 'CASCADE', 'CASCADE');

        $this->forge->createTable('order_items');
    }

    public function down()
    {
        $this->forge->dropTable('order_items', true);
    }
}
