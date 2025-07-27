<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table      = 'users';
    protected $primaryKey = 'id';

    // Aktifkan timestamps jika kamu menggunakan created_at dan updated_at
    protected $useTimestamps = true;

    // Kolom yang diizinkan untuk disimpan
    protected $allowedFields = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'no_telp',
        'nama_rekening',
        'rekening',
        'nama_bank',
        'alamat',
        'created_by',
        'is_active'
    ];

    // Tipe pengembalian data
    protected $returnType = 'array';

    // Validasi opsional
    protected $validationRules    = [];
    protected $validationMessages = [];
    protected $skipValidation     = true; // kamu bisa ubah ini ke false kalau pakai validasi bawaan
}
