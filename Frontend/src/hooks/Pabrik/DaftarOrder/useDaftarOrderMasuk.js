import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../../services/ordersApi';

export const useDaftarOrderMasuk = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            try {
                const allOrders = await fetchOrders();

                // Filter status order ('approved' dan 'processing')
                const filtered = allOrders.filter(order => 
                    ['approved', 'processing'].includes(order.status)
                );

                setOrders(filtered);
                setFilteredOrders(filtered);
            } catch (error) {
                console.error('❌ Gagal memuat orders:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const searchOrders = (query) => {
        setSearch(query);
        const lowerQuery = query.toLowerCase();

        const result = orders.filter(order =>
            order.orderId.toLowerCase().includes(lowerQuery) ||
            order.distributorName?.toLowerCase().includes(lowerQuery) ||
            String(order.agentId).toLowerCase().includes(lowerQuery)
        );

        setFilteredOrders(result);
    };

    const handleDetail = (order) => {
        navigate('/pabrik/detail-order', { state: { order } });
    };

    return {
        daftarOrders: filteredOrders,
        searchOrders,
        search,
        loading,
        handleDetail,
    };
};
