<?php

namespace App\Controllers;

use App\Models\ProductPriceModel;
use CodeIgniter\Controller;

class ProductPriceController extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = new ProductPriceModel();
    }

    public function index()
    {
        $role = $this->request->getGet('role') ?? 'pabrik'; // default pabrik
        $data['title'] = 'Daftar Harga ' . ucfirst($role);
        $data['role'] = $role;
        $data['produk'] = $this->model->where('role', $role)->findAll();

        return view('ProductPrice/index', $data);
    }

    public function store()
    {
        $this->model->save([
            'nama_produk' => $this->request->getPost('nama_produk'),
            'kode_produk' => $this->request->getPost('kode_produk'),
            'harga'       => $this->request->getPost('harga'),
            'role'        => $this->request->getPost('role'),
        ]);

        return redirect()->back()->with('message', 'Produk berhasil ditambahkan');
    }

    public function update($id)
    {
        $this->model->update($id, [
            'nama_produk' => $this->request->getPost('nama_produk'),
            'kode_produk' => $this->request->getPost('kode_produk'),
            'harga'       => $this->request->getPost('harga'),
        ]);

        return redirect()->back()->with('message', 'Produk berhasil diperbarui');
    }

    public function delete($id)
    {
        $this->model->delete($id);
        return redirect()->back()->with('message', 'Produk berhasil dihapus');
    }
}
