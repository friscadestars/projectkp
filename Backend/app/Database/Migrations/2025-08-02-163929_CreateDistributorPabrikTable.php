<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDistributorPabrikTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'             => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'distributor_id'       => ['type' => 'INT', 'unsigned' => true],
            'pabrik_id' => ['type' => 'INT', 'unsigned' => true],
            'created_at'     => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('distributor_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('pabrik_id', 'users', 'id', 'CASCADE', 'CASCADE');

        $this->forge->createTable('distributor_pabrik');
    }

    public function down()
    {
        $this->forge->dropTable('distributor_pabrik');
    }
}
