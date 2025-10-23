import { useEffect, useState } from 'react';
import { fetchCompletedOrdersForHistory } from '../../../services/ordersApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const LOCAL_STORAGE_KEY = 'deletedDistributorOrderIds';

export const useRiwayatOrderDistributor = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getDeletedIds = () => {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await fetchCompletedOrdersForHistory('distributor');

                const deletedIds = getDeletedIds();
                const maxDeletedId = Math.max(...deletedIds.map(Number), 0);
                const maxOrderId = Math.max(...result.map(o => Number(o.id)), 0);

                let validDeletedIds = deletedIds;
                if (maxOrderId > maxDeletedId) {
                    validDeletedIds = [];
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
                }

                const filteredOrders = result.filter(o => !validDeletedIds.includes(String(o.id)));
                setOrders(filteredOrders);
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
                headers: { 'Content-Type': 'application/json' }
            });

            const deletedIds = getDeletedIds();
            if (!deletedIds.includes(String(id))) {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...deletedIds, String(id)]));
            }

            setOrders(prev => prev.filter(order => String(order.id) !== String(id)));
        } catch (err) {
            console.error('Gagal menghapus order:', err);
        }
    };

    return { orders, loading, error, handleDelete };
};
