import { useEffect, useMemo, useState } from 'react';
import { fetchOrders } from '../../../services/ordersApi';

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
                console.log("DEBUG ORDERS dari API ===>", allOrders);

                setOrders(
                    allOrders.filter((o) => {
                        const status = (o.status || '').toLowerCase();
                        const paymentStatus = (o.statusPembayaran || '').toLowerCase();
                        const invoiceExist = o.invoiceExist === true || o.invoiceId != null;

                        if (allowedStatuses.includes(status)) return true;

                        if (['delivered', 'diterima'].includes(status)) {
                            return !invoiceExist || paymentStatus !== 'paid';
                        }

                        return false;
                    })
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
            .map((o) => {
                return {
                    id: o.order_id ?? o.id,
                    orderId: o.order_id ?? o.id,
                    orderCode: o.order_code ?? o.orderCode,

                    agen_id: o.agen_id ?? o.agentId ?? null,
                    agenName: o.agenName ?? '-',

                    pabrikName: o.pabrikName ?? o.pabrik_name ?? 'Pabrik tidak diketahui',
                    orderDate: o.created_at ?? o.orderDate ?? '-',
                    deliveryDate: o.deliveryDate ?? '-',
                    status: o.status,
                    products: o.products ?? [],
                    distributorId: o.distributor_id ?? o.distributorId ?? null,

                    invoiceExistDistributorToAgen: o.invoiceExist ?? false,
                    invoiceId: o.invoiceId ?? null,
                    payment_status: o.statusPembayaran ?? null,
                };
            })
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
