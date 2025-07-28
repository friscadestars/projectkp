// src/hooks/Distributor/Dashboard/useDashboardData.js
import { useOrder } from '../../../Context/OrderContext';

export const useDashboardData = () => {
    const { orders } = useOrder();

    // Konversi dan sortir tanggal (tanggal kirim)
    const parseDate = (dateString) => {
        if (!dateString) return new Date(0); // fallback
        const parts = dateString.split(/[/-]/); // mendukung '2025-07-28' atau '28/07/2025'
        if (parts[0].length === 4) {
            return new Date(parts[0], parts[1] - 1, parts[2]); // yyyy-mm-dd
        }
        return new Date(parts[2], parts[1] - 1, parts[0]); // dd/mm/yyyy
    };

    // === ✅ Filter dan Hitung ===
    const orderMasuk = orders.filter(o => (o.status || '').toLowerCase() === 'pending');
    const orderDikirim = orders.filter(o => (o.status || '').toLowerCase() === 'shipped');
    const orderSelesai = orders.filter(o => (o.status || '').toLowerCase() === 'received');

    const sortedOrders = [...orderDikirim]
        .sort((a, b) => parseDate(b.orderDate) - parseDate(a.orderDate));

    // === ✅ Card Summary ===
    const summaryCards = [
        { title: 'Order Masuk', value: orderMasuk.length },
        { title: 'Pengiriman', value: orderDikirim.length },
        { title: 'Order Selesai', value: orderSelesai.length },
    ];

    return { sortedOrders, summaryCards };
};
