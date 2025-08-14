// useDetailRiwayat.js
import { useEffect, useState } from 'react';
import { fetchCompletedOrdersForHistory } from '../../../services/ordersApi';
import { API_BASE, getAuthHeader } from '../../../services/apiConfig';

export const useDetailRiwayat = () => {
  const [orders, setOrders] = useState([]);
  const [productPrices, setProductPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await fetchCompletedOrdersForHistory('pabrik');
        setOrders(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Fetch harga pabrik
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(`${API_BASE}/prices?role=pabrik`, {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });
        const data = await res.json();
        setProductPrices(data || []);
      } catch (err) {
        console.error('Gagal fetch harga pabrik:', err);
      }
    };
    fetchPrices();
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

  return { orders, productPrices, loading, error, handleDelete };
};
