<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class Auth extends Controller
{
    public function login()
    {
        return view('auth/login');
    }

    public function loginPost()
    {
        $session = session();
        $model = new UserModel();
        $email = $this->request->getPost('email');
        $password = $this->request->getPost('password');

        $user = $model->where('email', $email)->first();

        if ($user && password_verify($password, $user['password'])) {
            $session->set([
                'user_id' => $user['id'],
                'email' => $user['email'],
                'logged_in' => true
            ]);
             switch ($user['role']) {
            case 'agen':
                return redirect()->to('/dashboard/agen');
            case 'distributor':
                return redirect()->to('/dashboard/distributor');
            case 'pabrik':
                return redirect()->to('/dashboard/pabrik');
        }
        } else {
            return redirect()->back()->with('error', 'Email atau Password salah');
        }
    }

    public function logout()
    {
        session()->destroy();
        return redirect()->to('/login');
    }

    public function register()
    {
        return view('auth/register');
    }

    public function registerPost()
   {
    $validation = \Config\Services::validation();
    $validation->setRules([
        'name'     => 'required|min_length[3]',
        'email'    => 'required|valid_email|is_unique[users.email]',
        'password' => 'required|min_length[6]',
        'role'     => 'required|in_list[agen,distributor,pabrik]'
    ]);

    if (!$validation->withRequest($this->request)->run()) {
        return redirect()->back()->withInput()->with('error', implode('<br>', $validation->getErrors()));
    }

    $model = new \App\Models\UserModel();
    $model->insert([
        'name'     => $this->request->getPost('name'),
        'email'    => $this->request->getPost('email'),
        'password' => password_hash($this->request->getPost('password'), PASSWORD_DEFAULT),
        'role'     => $this->request->getPost('role')
    ]);

    return redirect()->to('login')->with('success', 'Registrasi berhasil. Silakan login.');
}
}
