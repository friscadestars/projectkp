import { useEffect, useState } from 'react';
import { fetchCompletedOrdersForHistory } from '../../../services/ordersApi';
import { useAuth } from '../../../Context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const useRiwayatPengiriman = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productPrices, setProductPrices] = useState([]);
    const [error, setError] = useState(null);

    const { token } = useAuth();

    const authHeader = {
        Authorization: `Bearer ${token}`,
    };

    // Ambil data order selesai untuk pabrik
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

    // Ambil harga produk untuk pabrik
    useEffect(() => {
        const fetchProductPrices = async () => {
            try {
                const res = await fetch(`${API_BASE}/prices?role=pabrik`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...authHeader
                    }
                });

                const data = await res.json();
                setProductPrices(data || []);
            } catch (err) {
                console.error('Gagal fetch harga pabrik:', err);
            }
        };

        fetchProductPrices();
    }, [token]);

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_BASE}/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader
                }
            });
            setOrders((prev) => prev.filter((order) => order.id !== String(id)));
        } catch (err) {
            console.error('Gagal menghapus order:', err);
        }
    };

    return { orders, productPrices, loading, error, handleDelete };
};
