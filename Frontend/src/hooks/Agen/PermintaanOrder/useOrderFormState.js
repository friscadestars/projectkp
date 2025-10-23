import { useState, useEffect } from 'react';
import { useOrder } from "../../../Context/OrderContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const toMySQLDatetime = (d = new Date()) =>
  d.toISOString().slice(0, 19).replace('T', ' ');

const useOrderFormState = ({ agentId, distributorInfo, orders, onSuccess }) => {
  const { addNewOrder } = useOrder();

  const [produkList, setProdukList] = useState([]);
  const [produk, setProduk] = useState(null);
  const [jumlah, setJumlah] = useState("");
  const [harga, setHarga] = useState("");
  const [alamat, setAlamat] = useState("");
  const [lastOrderId, setLastOrderId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    if (user.alamat) {
      setAlamat(user.alamat);
    }
  }, []);

  const handleAddProduk = () => {
    const jumlahParsed = parseInt(jumlah, 10);
    const hargaParsed = parseInt(harga, 10);

    if (!produk || !produk.kode_produk || isNaN(jumlahParsed) || isNaN(hargaParsed)) return;

    setProdukList((prev) => [
      ...prev,
      {
        kode_produk: produk.kode_produk,
        nama_produk: produk.nama_produk ?? produk.nama ?? '-',
        jumlah: jumlahParsed,
        harga: hargaParsed,
      },
    ]);

    setProduk(null);
    setJumlah("");
    setHarga("");
  };

  const handleDeleteProduk = (index) => {
    setProdukList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!produkList.length || !alamat.trim()) {
      return { success: false, message: "Produk dan alamat harus diisi" };
    }

    const payload = {
      agen_id: Number(agentId),
      distributor_id: Number(distributorInfo.id),
      pabrik_id: null,
      status: 'pending',
      order_date: toMySQLDatetime(),
      delivery_date: null,
      resi: null,
      accepted_at: null,
      note: alamat,
      products: produkList.map(p => ({
        kode_produk: p.kode_produk,
        product_name: p.nama_produk || p.nama,
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

      setLastOrderId(data?.data?.id || null);
      setProdukList([]);
      setProduk("");
      setJumlah("");
      setHarga("");

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
    lastOrderId,
    setProduk,
    setJumlah,
    setHarga,
    handleAddProduk,
    handleDeleteProduk,
    handleSubmit,
  };
};

export default useOrderFormState;
