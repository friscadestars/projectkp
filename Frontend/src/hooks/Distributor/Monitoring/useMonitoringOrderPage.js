// src/hooks/Distributor/Monitoring/useMonitoringOrderPage.js
import { useEffect, useMemo, useState } from 'react';
import { fetchOrders } from '../../../services/ordersApi';

// Hapus 'delivered' agar tidak ditampilkan di monitoring
const allowedStatuses = ['approved', 'processing', 'shipped', 'produced'];

export const toLabel = (status) => {
    const map = {
        approved: 'Disetujui',
        processing: 'Diproses',
        shipped: 'Dikirim',
        delivered: 'Diterima',
        cancelled: 'Dibatalkan',
        pending: 'Tertunda',
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
                const allOrders = await fetchOrders();
                console.log("DEBUG ORDERS ===>", allOrders);
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
                id: o.orderId,
                orderId: o.orderId,
                orderCode: o.orderCode,
                agentId: o.agentId,
                agen_id: o.agentId ?? o.agen_id ?? null,
                agenName: o.agenName ?? o.agen ?? '-',
                pabrikName: o.pabrikName ?? 'Pabrik tidak diketahui',
                orderDate: o.orderDate ?? '-',
                deliveryDate: o.deliveryDate ?? '-',
                status: o.status,
                products: o.products ?? [],
                invoiceExist: o.invoiceExist,
                invoice: o.invoice ?? null,
                payment_status: o.statusPembayaran ?? o.status_pembayaran ?? o.invoice_status ?? null,
                invoice_id: o.invoiceId ?? o.invoice_id ?? null,
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
