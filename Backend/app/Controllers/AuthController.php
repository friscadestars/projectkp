<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class AuthController extends ResourceController
{
    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
        helper(['form', 'url']);
    }

    // 🔐 API: REGISTER
    public function register()
{
    $data = $this->request->getJSON(true);

    // Validasi wajib
    if (
        !$data || !isset(
            $data['name'],
            $data['email'],
            $data['password'],
            $data['role'],
            $data['no_telp'],
            $data['nama_rekening'],
            $data['rekening']
        )
    ) {
        return $this->failValidationErrors(
            'Field wajib: name, email, password, role, no_telp, nama_rekening, rekening'
        );
    }

    // Cek apakah email sudah terdaftar
    $existingUser = $this->userModel->where('email', $data['email'])->first();
    if ($existingUser) {
        return $this->fail('Email sudah terdaftar', 409);
    }

    // Siapkan data untuk disimpan
    $userData = [
        'name'           => $data['name'],
        'email'          => $data['email'],
        'password'       => password_hash($data['password'], PASSWORD_BCRYPT),
        'role'           => $data['role'],
        'no_telp'        => $data['no_telp'],
        'nama_rekening'  => $data['nama_rekening'],
        'rekening'       => $data['rekening'],
        'alamat'         => $data['alamat'] ?? null, // opsional
    ];

    $this->userModel->insert($userData);

    return $this->respondCreated([
        'message' => 'Registrasi berhasil',
        'user_id' => $this->userModel->getInsertID()
    ]);
}


    // 🔐 API: LOGIN
    public function login()
    {
        $data = $this->request->getJSON(true);

        if (!$data || !isset($data['email'], $data['password'])) {
            return $this->failValidationErrors('Email dan password wajib diisi');
        }

        $user = $this->userModel->where('email', $data['email'])->first();

        if (!$user || !password_verify($data['password'], $user['password'])) {
            return $this->failUnauthorized('Email atau password salah');
        }

        // Ambil secret key dari .env
        $secretKey = getenv('JWT_SECRET') ?: 'default_key';
        $issuedAt  = time();
        $expire    = $issuedAt + 3600; // Token berlaku 1 jam

        $payload = [
            'iss' => 'ci4',
            'aud' => 'reactjs',
            'iat' => $issuedAt,
            'exp' => $expire,
            'data' => [
                'id'    => $user['id'],
                'email' => $user['email'],
                'role'  => $user['role']
            ]
        ];

        $token = JWT::encode($payload, $secretKey, 'HS256');

        return $this->respond([
            'message' => 'Login berhasil',
            'token'   => $token,
            'user'    => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
            ]
        ]);
    }
}
