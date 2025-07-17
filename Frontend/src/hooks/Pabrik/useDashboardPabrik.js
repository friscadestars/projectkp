import { useOrder } from '../../Context/OrderContext';

export const useDashboardPabrik = () => {
    const { orders } = useOrder();

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    // Filter hanya order yang sedang diproduksi atau sudah dikirim
    const filteredOrders = orders.filter(order =>
        order.status === 'Diproduksi' || order.status === 'Dikirim'
    );

    // Urutkan order terbaru di atas
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        return parseDate(b.orderDate) - parseDate(a.orderDate);
    });

    // Summary cards untuk Dashboard Pabrik
    const summaryCards = [
        { title: 'Order Masuk', value: orders.filter(o => o.status === 'Tertunda').length },
        { title: 'Sedang Diproduksi', value: orders.filter(o => o.status === 'Diproduksi').length },
        { title: 'Dikirim', value: orders.filter(o => o.status === 'Dikirim').length },
    ];

    return { sortedOrders, summaryCards };
};
