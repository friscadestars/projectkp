<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
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
// 🔐 API: REGISTER
public function register()
{
    $authHeader = $this->request->getHeaderLine('Authorization');
    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        return $this->failUnauthorized('Token tidak ditemukan.');
    }

    $token = $matches[1];
    $secretKey = getenv('JWT_SECRET') ?: 'default_key';

    try {
        $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
        $creatorId = $decoded->data->id;
        $creatorRole = $decoded->data->role;
    } catch (\Exception $e) {
        return $this->failUnauthorized('Token tidak valid.');
    }

    // Hirarki role
    $roleHierarchy = [
        'admin' => 'pabrik',
        'pabrik' => 'distributor',
        'distributor' => 'agen'
    ];

    // Cek apakah creator berhak membuat user
    if (!isset($roleHierarchy[$creatorRole])) {
        return $this->failForbidden('Role Anda tidak memiliki izin untuk mendaftarkan user.');
    }

    $allowedRole = $roleHierarchy[$creatorRole];

    $data = $this->request->getJSON(true);

    if (
        !$data || !isset(
            $data['nama'],
            $data['email'],
            $data['password'],
            $data['noTelepon'],
            $data['pemilikRekening'],
            $data['noRekening']
        )
    ) {
        return $this->failValidationErrors(
            'Field wajib: nama, email, password, noTelepon, pemilikRekening, noRekening'
        );
    }

    $existingUser = $this->userModel->where('email', $data['email'])->first();
    if ($existingUser) {
        return $this->fail('Email sudah terdaftar', 409);
    }

    $userData = [
        'name'           => $data['nama'],
        'username'       => $data['username'] ?? null,
        'email'          => $data['email'],
        'password'       => password_hash($data['password'], PASSWORD_BCRYPT),
        'role'           => $allowedRole,
        'no_telp'        => $data['noTelepon'],
        'nama_rekening'  => $data['pemilikRekening'],
        'rekening'       => $data['noRekening'],
        'nama_bank'      => $data['namaBank'] ?? null,
        'alamat'         => $data['alamat'] ?? null,
        'created_by'     => $creatorId // <- inilah yang menghubungkan siapa yang buat user ini
    ];

    $this->userModel->insert($userData);

    return $this->respondCreated([
        'message' => "User dengan role '{$allowedRole}' berhasil dibuat oleh {$creatorRole}",
        'user_id' => $this->userModel->getInsertID()
    ]);
}




    // 🔐 API: LOGIN
  public function login()
{
    $data = $this->request->getJSON(true);

    // Validasi input
    if (!$data || !isset($data['email'], $data['password'])) {
        return $this->failValidationErrors('Email dan password wajib diisi');
    }

    // Ambil user berdasarkan email
    $user = $this->userModel->where('email', $data['email'])->first();

    // Debug opsional
    // log_message('debug', 'Login attempt: ' . json_encode($data));
    // log_message('debug', 'User found: ' . json_encode($user));

    if (!$user) {
        return $this->failUnauthorized('Email tidak ditemukan');
    }

    // Verifikasi password
    if (!password_verify($data['password'], $user['password'])) {
        return $this->failUnauthorized('Password salah');
    }

    // Ambil secret key dari .env
    $secretKey = getenv('JWT_SECRET') ?: 'default_key';
    $issuedAt  = time();
    $expire    = $issuedAt + 3600; // Token berlaku 1 jam

    // Payload token
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

    // Encode token
    $token = JWT::encode($payload, $secretKey, 'HS256');

    // Response
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
