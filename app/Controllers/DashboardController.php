<?php

// app/Controllers/Dashboard.php
namespace App\Controllers;

class DashboardController extends BaseController
{
    public function agen()
    {
        return view('agen');
    }

    public function pabrik()
    {
        return view('pabrik');
    }

    public function distributor()
    {
        return view('distributor');
    }
}
