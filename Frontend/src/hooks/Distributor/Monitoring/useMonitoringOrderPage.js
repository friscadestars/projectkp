// src/hooks/Distributor/Monitoring/useMonitoringOrderPage.js
import { useEffect, useMemo, useState } from 'react';
import { fetchOrders } from '../../../services/ordersApi';

// Sesuaikan dengan yang di-backend
const allowedStatuses = ['approved', 'processing', 'shipped', 'delivered'];

export const toLabel = (status) => {
    const map = {
        approved: 'Disetujui',
        processing: 'Diproses',
        shipped: 'Dikirim',
        delivered: 'Diterima',
        cancelled: 'Dibatalkan',
        pending: 'Menunggu',
    };
    return map[status?.toLowerCase()] || status;
};

export const useMonitoringOrderPage = () => {
    const [search, setSearch] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const allOrders = await fetchOrders(); // <- langsung ke DB (via API)
                // filter hanya status yang relevan untuk monitoring
                setOrders(
                    allOrders.filter((o) =>
                        allowedStatuses.includes((o.status || '').toLowerCase())
                    )
                );
            } catch (e) {
                setErr(e.message || 'Gagal memuat orders');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filteredOrders = useMemo(() => {
        const q = search.toLowerCase();
        return orders
            .map((o) => ({
                id: o.orderId, // dari mapOrder -> String(o.id)
                orderId: o.orderId,
                orderCode: o.orderCode,
                agenName: o.agenName ?? o.agen ?? '-',
                pabrikName: o.pabrikName ?? 'Pabrik tidak diketahui',
                orderDate: o.orderDate ?? '-',
                deliveryDate: o.deliveryDate ?? '-', // ini yang tadinya estimatedDate
                status: o.status,
                products: o.products ?? [],
            }))
            .filter(
                (o) =>
                    (o.orderCode || '').toLowerCase().includes(q) ||
                    (o.orderId || '').toLowerCase().includes(q) ||
                    (o.agenName || '').toLowerCase().includes(q)
            );
    }, [orders, search]);

    return {
        search,
        setSearch,
        filteredOrders,
        loading,
        err,
        toLabel,
    };
};
