import { useEffect, useState } from 'react';
import { fetchCompletedOrdersForHistory } from '../../../services/ordersApi';
import { useAuth } from '../../../Context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const useRiwayatOrderDistributor = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productPrices, setProductPrices] = useState([]);
    const [error, setError] = useState(null);

    const { token } = useAuth();

    const authHeader = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await fetchCompletedOrdersForHistory('distributor');
                console.log("🧾 Riwayat Order dari Backend:", result);
                setOrders(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
                setProductPrices(data || []); // tidak perlu data.data karena controller-mu langsung return array
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
