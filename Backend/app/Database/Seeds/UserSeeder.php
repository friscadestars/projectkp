<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'name' => 'Pabrik Awal',
            'username' => 'pabrik_admin',
            'email' => 'pabrik@gmail.com',
            'password' => password_hash('pabrik123', PASSWORD_BCRYPT),
            'role' => 'pabrik',
            'no_telp' => '08123456789',
            'alamat' => 'Jl. Pabrik Raya No.1',
            'nama_rekening' => 'Pabrik Awal',
            'rekening' => '1234567890',
            'nama_bank' => 'BCA',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        $this->db->table('users')->insert($data);
    }
}
