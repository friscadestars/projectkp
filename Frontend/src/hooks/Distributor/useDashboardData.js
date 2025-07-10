import { useOrder } from '../../Context/OrderContext';

export const useDashboardData = () => {
    const { orders } = useOrder();

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    const filteredOrders = orders.filter(order =>
        order.status === 'Dikirim' || order.status === 'Diterima'
    );

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        return parseDate(b.orderDate) - parseDate(a.orderDate);
    });

    const summaryCards = [
        { title: 'Order Masuk', value: orders.filter(o => o.status === 'Tertunda').length },
        { title: 'Pengiriman', value: orders.filter(o => o.status === 'Dikirim').length },
        { title: 'Order Selesai', value: orders.filter(o => o.status === 'Diterima').length },
    ];

    return { sortedOrders, summaryCards };
};
