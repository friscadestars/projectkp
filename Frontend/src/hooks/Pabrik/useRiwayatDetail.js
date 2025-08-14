import { useEffect, useState } from 'react';
import { fetchCompletedOrdersForHistory } from '../../../services/ordersApi';
import { API_BASE, getAuthHeader } from '../../../services/apiConfig';

export const useDetailRiwayat = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fungsi normalisasi supaya pencocokan lebih fleksibel
  const normalize = (str) => (str || '').replace(/\s+/g, '').toLowerCase();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersResult, pricesRes] = await Promise.all([
          fetchCompletedOrdersForHistory('pabrik'),
          fetch(`${API_BASE}/prices?role=pabrik`, {
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader(),
            },
          }).then((res) => res.json()),
        ]);

        const mergedOrders = ordersResult.map((order) => ({
          ...order,
          products: order.products.map((p) => {
            const hargaPabrikData = pricesRes.find((price) => {
              return (
                normalize(price.kode_produk) === normalize(p.code) ||
                normalize(price.nama_produk) === normalize(p.name)
              );
            });

            if (!hargaPabrikData) {
              console.warn('[PRICE MISSING] Tidak ada harga pabrik untuk:', p);
            }

            return {
              ...p,
              hargaPabrik: hargaPabrikData
                ? Number(hargaPabrikData.harga)
                : Number(p.unitPrice ?? 0),
            };
          }),
        }));

        setOrders(mergedOrders);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      setOrders((prev) => prev.filter((order) => order.id !== String(id)));
    } catch (err) {
      console.error('Gagal menghapus order:', err);
    }
  };

  return { orders, loading, error, handleDelete };
};
