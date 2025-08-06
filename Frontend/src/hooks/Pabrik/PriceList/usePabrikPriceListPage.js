// PABRIK PRICE LIST HOOK

import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import {
  createPrice,
  deletePrice,
  fetchPrices,
  updatePrice,
} from "../../../services/pricesApi";

export function usePabrikPriceListPage() {
  const [produkList, setProdukList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ nama: '', kode: '', harga: '' });

  const role = 'pabrik';
  const userId = null; // Jika butuh ID pabrik bisa disesuaikan

  useEffect(() => {
    getHargaProduk();
  }, []);

  const getHargaProduk = async () => {
    try {
      const result = await fetchPrices(role, userId);
      const list = result.map((item) => ({
        id: item.id,
        nama: item.nama_produk,
        kode: item.kode_produk,
        harga: item.harga,
        isEditing: false,
      }));
      setProdukList(list);
    } catch (error) {
      console.error('Gagal ambil data harga:', error.message);
    }
  };

  const handleAdd = async () => {
    try {
      if (!form.nama || !form.kode || !form.harga) {
        Swal.fire('Gagal', 'Semua field harus diisi', 'warning');
        return;
      }

      const payload = {
        nama_produk: form.nama,
        kode_produk: form.kode,
        harga: parseInt(form.harga.replace(/\D/g, ''), 10),
      };

      const newData = await createPrice(payload, role, userId);

      const newEntry = {
        id: newData.id,
        nama: newData.nama_produk ?? form.nama,
        kode: newData.kode_produk ?? form.kode,
        harga: newData.harga ?? payload.harga,
        isEditing: false,
      };

      setProdukList((prev) => [...prev, newEntry]);

      setForm({ nama: '', kode: '', harga: '' });

      Swal.fire('Berhasil', 'Produk berhasil ditambahkan', 'success');
    } catch (e) {
      Swal.fire('Gagal', e.message || 'Gagal menambahkan produk', 'error');
    }
  };


  const handleEdit = (id) => {
    setProdukList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEditing: true } : { ...item, isEditing: false }
      )
    );
  };

  const handleSave = async (id, updatedData) => {
    try {
      const payload = {
        nama_produk: updatedData.nama_produk,
        kode_produk: updatedData.kode_produk,
        harga: updatedData.harga,
      };

      await updatePrice(id, payload);

      setProdukList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                nama: updatedData.nama_produk,
                kode: updatedData.kode_produk,
                harga: updatedData.harga,
                isEditing: false,
              }
            : item
        )
      );
      Swal.fire('Berhasil', 'Produk berhasil diperbarui', 'success');
    } catch (error) {
      console.error('Gagal update harga:', error.message);
      Swal.fire('Gagal', error.message || 'Gagal menyimpan perubahan', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePrice(id);
      setProdukList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Gagal menghapus data:', error.message);
    }
  };

  const filteredProduk = produkList.filter((produk) =>
    produk.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    pageTitleProps: {
      title: 'Daftar Harga Produk',
      subtitle: 'Kelola daftar harga untuk produk pabrik Anda',
    },
    form,
    setForm,
    handleAdd,
    handleEdit,
    handleSave,
    handleDelete,
    searchTerm,
    setSearchTerm,
    filteredProduk,
  };
}
