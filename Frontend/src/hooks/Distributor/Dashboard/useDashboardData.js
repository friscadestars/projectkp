import { useOrder } from '../../../Context/OrderContext';
import { useAuth } from '../../../Context/AuthContext';

export const useDashboardData = () => {
    const { orders } = useOrder();
    const { user } = useAuth();

    if (!user) return { summaryCards: [], sortedOrders: [] };

    const distributorOrders = orders.filter(
        (o) => String(o.distributorId) === String(user.id)
    );

    const parseDate = (dateString) => {
        if (!dateString) return new Date(0);
        const parts = dateString.split(/[/-]/);
        if (parts[0].length === 4) {
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }
        return new Date(parts[2], parts[1] - 1, parts[0]);
    };

    const normalize = (status) => (status || '').toLowerCase();

    const orderMasuk = distributorOrders.filter((o) =>
        normalize(o.status) === 'pending'
    );

    const orderDikirim = distributorOrders.filter(
        (o) => normalize(o.status) === 'shipped'
    );

    const orderSelesai = distributorOrders.filter((o) =>
        ['delivered', 'diterima'].includes(normalize(o.status))
    );

    const sortedOrders = [...orderDikirim].sort(
        (a, b) => parseDate(b.orderDate) - parseDate(a.orderDate)
    );

    const summaryCards = [
        { title: 'Order Masuk', value: orderMasuk.length },
        { title: 'Pengiriman', value: orderDikirim.length },
        { title: 'Order Selesai', value: orderSelesai.length },
    ];

    return { sortedOrders, summaryCards };
};
