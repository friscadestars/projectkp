import { useEffect, useState } from 'react';
import { fetchCompletedOrdersForHistory } from '../../../services/ordersApi';
import { useAuth } from '../../../Context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const LOCAL_STORAGE_KEY = 'deletedAgenOrderIds';

export const useRiwayatPengiriman = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productPrices, setProductPrices] = useState([]);
    const [error, setError] = useState(null);

    const { token } = useAuth();

    const authHeader = {
        Authorization: `Bearer ${token}`,
    };

    // Fungsi ambil deletedIds yang valid
    // Ambil deletedIds yang valid
    const getValidDeletedIds = (currentOrders) => {
        const deletedKeys = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        const currentKeys = currentOrders.map(o => `${o.orderId}-${o.distributorId}`);
        const validDeletedKeys = deletedKeys.filter(key => currentKeys.includes(key));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(validDeletedKeys));
        return validDeletedKeys;
    };

    // Ambil data order selesai untuk pabrik
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await fetchCompletedOrdersForHistory('pabrik');

                const validDeletedKeys = getValidDeletedIds(result);

                const filteredOrders = result.filter(
                    o => !validDeletedKeys.includes(`${o.orderId}-${o.distributorId}`)
                );

                setOrders(filteredOrders);
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

    const handleDelete = async (id, distributorId) => {
        try {
            await fetch(`${API_BASE}/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader
                }
            });

            const deletedKeys = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
            const key = `${id}-${distributorId}`;
            if (!deletedKeys.includes(key)) {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...deletedKeys, key]));
            }

            setOrders(prev => prev.filter(o => `${o.orderId}-${o.distributorId}` !== key));
        } catch (err) {
            console.error('Gagal menghapus order:', err);
        }
    };

    return { orders, productPrices, loading, error, handleDelete };
};
