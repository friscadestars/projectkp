<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateShipmentsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'order_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => false,
            ],
            'shipping_date' => [
                'type' => 'DATETIME',
                'null' => false,
            ],
            'estimated_delivery' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'delivery_status' => [
                'type'       => 'ENUM',
                'constraint' => ['pending', 'processing', 'shipped', 'in_transit', 'delivered', 'failed'],
                'default'    => 'pending',
                'null'       => false,
            ],
            'tracking_number' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true,
            ],
            'carrier' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true,
            ],
            'shipping_address' => [
                'type' => 'TEXT',
                'null' => false,
            ],
            'shipping_cost' => [
                'type'       => 'DECIMAL',
                'constraint' => '12,2',
                'null'       => false,
                'default'    => '0.00',
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'created_at' => [
                'type'    => 'DATETIME',
                'null'    => true,
            ],
            'updated_at' => [
                'type'    => 'DATETIME',
                'null'    => true,
            ],
        ]);

        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('order_id', 'orders', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('shipments');

        // Index tambahan
        $this->db->query('CREATE INDEX shipments_order_id_idx ON shipments(order_id)');
        $this->db->query('CREATE INDEX shipments_tracking_idx ON shipments(tracking_number)');
    }

    public function down()
    {
        $this->forge->dropTable('shipments', true);
    }
}
