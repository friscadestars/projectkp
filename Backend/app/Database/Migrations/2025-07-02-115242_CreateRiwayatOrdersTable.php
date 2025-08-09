<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateRiwayatOrdersTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'unsigned'       => true,
                'auto_increment' => true,
                'constraint'     => 11
            ],
            'order_id' => [
                'type'       => 'INT',
                'unsigned'   => true,
                'null'       => false
            ],
            'order_code' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
                'null'       => false
            ],
            'distributor' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => false
            ],
            'tanggal_order' => [
                'type' => 'DATE',
                'null' => false
            ],
            'tanggal_terima' => [
                'type' => 'DATE',
                'null' => true
            ],
            'no_resi' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true
            ],
            'total_harga' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
                'null'       => false
            ],
            'status_order' => [
                'type'       => 'ENUM',
                'constraint' => ['delivered', 'rejected'],
                'default'    => 'delivered',
                'null'       => false
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->createTable('riwayat_orders');
    }

    public function down()
    {
        $this->forge->dropTable('riwayat_orders', true);
    }
}
