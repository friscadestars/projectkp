// src/hooks/Agen/useRiwayatOrder.js
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompletedOrdersForHistory } from '../../../services/ordersApi';

const useRiwayatOrder = () => {
    const [orders, setOrders] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchCompletedOrdersForHistory();
                if (mounted) setOrders(data);
            } catch (e) {
                if (mounted) setError(e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const handleDelete = (id) => {
        if (confirm("Hapus riwayat order ini?")) {
            setOrders((prev) => prev.filter((o) => o.orderId !== id));
        }
    };

    const handleDetail = (order) => {
        navigate('/agen/detail-order', { state: { order, from: 'riwayat' } });
    };

    return {
        showDropdown,
        setShowDropdown,
        handleDelete,
        handleDetail,
        completedOrders: orders,
        loading,
        error
    };
};

export default useRiwayatOrder;
