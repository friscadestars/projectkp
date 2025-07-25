<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUsersTable extends Migration
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
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => false
            ],
            'username' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => false,
                'unique'     => true
            ],
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => false,
                'unique'     => true
            ],
            'password' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => false
            ],
            'role' => [
                'type'       => 'ENUM',
                'constraint' => ['agen', 'distributor', 'pabrik'],
                'default'    => 'agen',
                'null'       => false
            ],
            'no_telp' => [
                'type'       => 'VARCHAR',
                'constraint' => 15,
                'null'       => false,
                'unique'     => true
            ],
            'alamat' => [
                'type' => 'TEXT',
                'null' => true
            ],
            'nama_rekening' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true
            ],
            'rekening' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true
            ],
            'nama_bank' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true
            ],
            // // ✅ Tambahan kolom status aktif
            'is_active' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 1,
                'null'       => false
            ],
            'created_by' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true
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
        $this->forge->addForeignKey('created_by', 'users', 'id', 'SET NULL', 'CASCADE');
        $this->forge->createTable('users');
    }

    public function down()
    {
        $this->forge->dropTable('users', true);
    }
}
