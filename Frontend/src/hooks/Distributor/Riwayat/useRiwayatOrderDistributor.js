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
    const authHeader = { Authorization: `Bearer ${token}` };

    // Ambil daftar ID yang dihapus dari localStorage
    const getDeletedIds = () => JSON.parse(localStorage.getItem('deletedOrderIds') || '[]');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await fetchCompletedOrdersForHistory('distributor');

                // Filter agar tidak menampilkan order yang sudah dihapus di UI sebelumnya
                const deletedIds = getDeletedIds();
                const filtered = result.filter(order => !deletedIds.includes(order.id));

                setOrders(filtered);
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
                setProductPrices(data || []);
            } catch (err) {
                console.error('Gagal fetch harga pabrik:', err);
            }
        };

        fetchProductPrices();
    }, [token]);

    // Hapus hanya di UI dan simpan di localStorage
    const handleDelete = (id) => {
        setOrders((prev) => prev.filter((order) => order.id !== String(id)));

        const deletedIds = getDeletedIds();
        if (!deletedIds.includes(id)) {
            localStorage.setItem('deletedOrderIds', JSON.stringify([...deletedIds, id]));
        }
    };

    return { orders, productPrices, loading, error, handleDelete };
};

