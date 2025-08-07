import { useOrder } from '../../Context/OrderContext';

export const useDashboardPabrik = () => {
    const { orders } = useOrder();

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    // Pemetaan status backend ke label UI
    const statusMap = {
        approved: 'Order Masuk',
        processing: 'Sedang Diproduksi',
        shipped: 'Dikirim',
    };

    // Filter orders yang tampil di tabel pengiriman aktif
    const filteredOrders = orders.filter(order =>
        order.status === 'processing' || order.status === 'shipped'
    );

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        return parseDate(b.orderDate) - parseDate(a.orderDate);
    });

    // Summary cards untuk dashboard
    const summaryCards = [
        { title: 'Order Masuk', value: orders.filter(o => o.status === 'approved').length },
        { title: 'Sedang Diproduksi', value: orders.filter(o => o.status === 'processing').length },
        { title: 'Dikirim', value: orders.filter(o => o.status === 'shipped').length },
    ];

    return { sortedOrders, summaryCards };
};

