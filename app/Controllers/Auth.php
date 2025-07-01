<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class Auth extends Controller
{
    /**
     * Tampilkan halaman register
     */
    public function register()
    {
        return view('auth/register');
    }

    /**
     * Proses data registrasi
     */
    public function registerPost()
    {
        $validation = \Config\Services::validation();

        $rules = [
            'name'     => 'required|min_length[3]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[6]',
            'role'     => 'required|in_list[agen,distributor,pabrik]'
        ];

        if (!$validation->setRules($rules)->withRequest($this->request)->run()) {
            return redirect()->back()
                             ->withInput()
                             ->with('validation_errors', $validation->getErrors());
        }

        $model = new UserModel();

        $model->save([
            'name'     => $this->request->getPost('name'),
            'email'    => $this->request->getPost('email'),
            'password' => $this->request->getPost('password'), // pastikan UserModel hash password
            'role'     => $this->request->getPost('role')
        ]);

        return redirect()->to('/login')->with('success', 'Registrasi berhasil. Silakan login.');
    }

    /**
     * Tampilkan halaman login
     */
    public function login()
    {
        return view('auth/login');
    }

    /**
     * Proses data login
     */
   public function loginPost()
{
    $session = session();
    $model   = new UserModel();

    $email    = trim($this->request->getPost('email'));
    $password = $this->request->getPost('password');
    $selectedRole = $this->request->getPost('role');

    // Validasi input kosong
    if (empty($email) || empty($password)) {
        return redirect()->back()->withInput()->with('error', 'Email dan Password harus diisi.');
    }

    // Validasi format email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return redirect()->back()->withInput()->with('error', 'Format email tidak valid.');
    }

    // Cari user berdasarkan email
    $user = $model->where('email', $email)->first();

    if (!$user || !password_verify($password, $user['password'])) {
        return redirect()->back()->withInput()->with('error', 'Email atau Password salah.');
    }
    if ($user['role'] !== $selectedRole) {
    return redirect()->back()->withInput()->with('error', 'Role tidak sesuai dengan akun.');
}

    // Simpan session jika sukses login
    $session->set([
        'user_id'   => $user['id'],
        'email'     => $user['email'],
        'role'      => $user['role'],
        'logged_in' => true
    ]);

    // Arahkan berdasarkan role
    switch ($user['role']) {
       case 'agen':
            return redirect()->to('/Agen');
        case 'pabrik':
            return redirect()->to('/Pabrik');
        case 'distributor':
            return redirect()->to('/Distributor');
        default:
            $session->destroy(); // bersihkan session jika role tidak valid
            return redirect()->to('/login')->with('error', 'Role tidak dikenali.');
    }
}


    /**
     * Logout dan hapus session
     */
    public function logout()
    {
        session()->destroy();
        return redirect()->to('/login');
    }
}
