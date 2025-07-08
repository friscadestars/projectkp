<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateProductPricesTable extends Migration
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
            'nama_produk' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => false
            ],
            'kode_produk' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => false
            ],
            'harga' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
                'null'       => false
            ],
            'role' => [
                'type'       => 'ENUM',
                'constraint' => ['pabrik', 'distributor'],
                'null'       => false
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

        $this->forge->addKey('id', true);
        $this->forge->createTable('product_prices');
    }

    public function down()
    {
        $this->forge->dropTable('product_prices', true);
    }
}
