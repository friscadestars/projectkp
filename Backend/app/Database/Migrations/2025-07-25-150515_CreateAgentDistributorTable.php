<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAgentDistributorTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'             => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'agent_id'       => ['type' => 'INT', 'unsigned' => true],
            'distributor_id' => ['type' => 'INT', 'unsigned' => true],
            'created_at'     => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('agent_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('distributor_id', 'users', 'id', 'CASCADE', 'CASCADE');

        $this->forge->createTable('agent_distributor');
    }

    public function down()
    {
        $this->forge->dropTable('agent_distributor');
    }
}
