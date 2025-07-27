// src/hooks/Distributor/Monitoring/useMonitoringOrderPage.js
import { useMemo, useState } from 'react';
import { useOrder } from '../../../Context/OrderContext';

const allowedStatuses = ['approved', 'processed', 'shipped', 'received'];

const toLabel = (status) => {
    const map = {
        approved: 'Disetujui',
        processed: 'Diproses',
        shipped: 'Dikirim',
        received: 'Diterima',
    };
    return map[status?.toLowerCase()] || status;
};

export const useMonitoringOrderPage = () => {
    const [search, setSearch] = useState('');
    const { orders } = useOrder();

    // Ambil order yang status-nya untuk monitoring
    const monitoringOrders = useMemo(
        () => orders.filter(o => allowedStatuses.includes((o.status || '').toLowerCase())),
        [orders]
    );

    // Cari berdasarkan orderCode / orderId
    const filteredOrders = useMemo(() => {
        const q = search.toLowerCase();
        return monitoringOrders
            .map(o => ({
                id: o.id,
                orderId: o.orderId || o.id,
                orderCode: o.orderCode || o.order_code || `ORD-${o.id}`,
                agenId: o.agenId || o.agen_id || o.agenName || o.agen || '-',
                pabrikId: o.pabrikId || o.pabrik_id || '-',
                pabrikName: o.pabrikName || o.pabrik_name || 'Pabrik tidak diketahui',
                orderDate: o.orderDate || o.order_date?.split(' ')[0] || '-',
                estimatedDate: o.estimatedDate || o.delivery_date || '-',
                status: o.status,
                products: o.products || o.items || [],
            }))
            .filter(o =>
                (o.orderCode || '').toLowerCase().includes(q) ||
                (o.orderId || '').toLowerCase().includes(q) ||
                (o.agenId || '').toLowerCase().includes(q)
            );
    }, [monitoringOrders, search]);

    return {
        search,
        setSearch,
        filteredOrders,
        toLabel, // jika mau dipakai di tempat lain
    };
};
