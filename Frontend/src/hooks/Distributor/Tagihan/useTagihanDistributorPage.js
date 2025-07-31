// hooks/useTagihanDistributorPage.js
import { useState, useEffect } from 'react';
import { fetchOrders } from '../../../services/ordersApi'; // pastikan path sesuai

export const useTagihanDistributorPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const result = await fetchOrders();
                setOrders(result);
            } catch (err) {
                console.error('Gagal memuat orders:', err);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    return { searchTerm, setSearchTerm, orders, loading };
};
