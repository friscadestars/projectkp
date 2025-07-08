<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table            = 'users';
    protected $primaryKey       = 'id';

    protected $allowedFields    = [
        'name', 'no_telp', 'email', 'password', 'role', 'alamat', 'nama_rekening', 'rekening'
    ];

    protected $useTimestamps = true;
    protected $returnType    = 'array';
}
