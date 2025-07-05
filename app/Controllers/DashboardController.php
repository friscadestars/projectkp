<?php

namespace App\Controllers;

class DashboardController extends BaseController
{
    public function index()
    {
        $role = session('role'); // atau bisa dari token jika pakai auth

        switch ($role) {
            case 'agen':
                return view('dashboard/agen');
            case 'distributor':
                return view('dashboard/distributor');
            case 'pabrik':
                return view('dashboard/pabrik');
            default:
                return redirect()->to('/');
        }
    }
}
