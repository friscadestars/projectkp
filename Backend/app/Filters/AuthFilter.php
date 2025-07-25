<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return response()->setJSON([
                'message' => 'Token tidak ditemukan'
            ])->setStatusCode(401);
        }

        $token = $matches[1];
        $secretKey = getenv('JWT_SECRET'); // Pindahkan ke .env pada produksi

        try {
            $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
            $request->user = $decoded->data;
            // Token valid, bisa digunakan untuk menetapkan user aktif di context jika perlu
            // Misalnya simpan di request attribute atau ke session jika dibutuhkan

            return null; // lanjutkan request
        } catch (\Exception $e) {
            return response()->setJSON([
                'message' => 'Token tidak valid',
                'error' => $e->getMessage()
            ])->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Tidak digunakan
    }
}
