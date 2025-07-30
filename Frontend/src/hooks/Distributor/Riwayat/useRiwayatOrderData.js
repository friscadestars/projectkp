import { useEffect, useState } from 'react';
import { fetchCompletedOrdersForHistory } from '../../../services/ordersApi';

export const useRiwayatOrderDistributor = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await fetchCompletedOrdersForHistory('distributor');
                setOrders(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_BASE}/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                }
            });
            setOrders((prev) => prev.filter((order) => order.id !== String(id)));
        } catch (err) {
            console.error('Gagal menghapus order:', err);
        }
    };

    return { orders, loading, error, handleDelete };
};
