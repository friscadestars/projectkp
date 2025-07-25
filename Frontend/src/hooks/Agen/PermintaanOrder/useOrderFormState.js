import { useState } from 'react';
import { useOrder } from "../../../Context/OrderContext";

// ✅ Pastikan BASE_URL mengarah ke /api
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Fungsi untuk format tanggal ke format MySQL
const toMySQLDatetime = (d = new Date()) =>
  d.toISOString().slice(0, 19).replace('T', ' ');

const useOrderFormState = ({ agentId, distributorInfo, orders, onSuccess }) => {
  const { addNewOrder } = useOrder();

  const [produkList, setProdukList] = useState([]);
  const [produk, setProduk] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [harga, setHarga] = useState("");
  const [alamat, setAlamat] = useState("");

  // Tambahkan produk ke daftar
  const handleAddProduk = () => {
    if (!produk || !jumlah || !harga) return;
    setProdukList((prev) => [
      ...prev,
      {
        nama: produk,
        jumlah: parseInt(jumlah, 10),
        harga: parseInt(harga, 10),
      },
    ]);
    setProduk("");
    setJumlah("");
    setHarga("");
  };

  // Hapus produk dari daftar
  const handleDeleteProduk = (index) => {
    setProdukList((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit order
  const handleSubmit = async () => {
    if (!produkList.length || !alamat) {
      return { success: false, message: "Produk dan alamat harus diisi" };
    }

    const payload = {
      agen_id: Number(agentId), // FK orders
      distributor_id: Number(distributorInfo.id), // FK orders
      pabrik_id: null,
      status: 'pending',
      order_date: toMySQLDatetime(),
      delivery_date: null,
      resi: null,
      accepted_at: null,
      note: alamat,
      products: produkList.map(p => ({
        product_name: p.nama,
        quantity: p.jumlah,
        unit_price: p.harga,
        address: alamat
      }))
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ✅ Tambahkan token jika pakai autentikasi bearer
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, message: err?.message || 'Gagal membuat order' };
      }

      const data = await res.json();

      addNewOrder?.({
        ...data.data,
        products: produkList,
        alamat
      });

      // Reset form
      setProdukList([]);
      setAlamat("");

      onSuccess?.();
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Network/Server error' };
    }
  };

  return {
    produk,
    jumlah,
    harga,
    produkList,
    alamat,
    setProduk,
    setJumlah,
    setHarga,
    setAlamat,
    handleAddProduk,
    handleDeleteProduk,
    handleSubmit,
  };
};

export default useOrderFormState;
