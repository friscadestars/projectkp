import { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '../../useNavigation';
import { agenMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';
import { useOrder } from '../../../Context/OrderContext';

const parseDate = (dateString) => {
    if (!dateString) return new Date(0);
    const [d, m, y] = dateString.split(/[/-]/).map(Number);
    return new Date(y, m - 1, d);
};

const normalize = (status) => (status || '').toLowerCase();

export const useDashboardAgenPage = () => {
    const { orders, fetchOrders } = useOrder();
    // const { orders } = useOrder();
    const { handleNavigation } = useNavigation(agenMenuItems);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    let user = {};
    try {
        const stored = localStorage.getItem('user');
        user = stored ? JSON.parse(stored) : {};
    } catch {
        user = {};
    }

    const agenId = Number(user?.id);

    useEffect(() => {
        if (!orders || orders.length === 0) {
            fetchOrders();
        }
    }, [orders, fetchOrders]);

    useEffect(() => {
        if (orders.length > 0 && agenId) {
            const agenOrders = orders.filter(order => Number(order.agentId) === agenId);
            setFilteredOrders(agenOrders);
            setLoading(false);
        }
    }, [orders, agenId]);

    const orderMasuk = filteredOrders.filter((o) =>
        normalize(o.status) === 'pending'
    );

    const orderDikirim = filteredOrders.filter((o) =>
        normalize(o.status) === 'shipped'
    );

    const orderSelesai = filteredOrders.filter((o) => {
        const status = normalize(o.status);
        return ['delivered', 'diterima'].includes(status);
    });

    const sortedOrders = [...orderDikirim].sort(
        (a, b) => parseDate(b.orderDate) - parseDate(a.orderDate)
    );

    const summaryCards = [
        { title: 'Order Masuk', value: orderMasuk.length },
        { title: 'Pengiriman', value: orderDikirim.length },
        { title: 'Order Selesai', value: orderSelesai.length },
    ];

    const totalAktif = filteredOrders.filter((o) => {
        const status = normalize(o.status);
        return !['delivered', 'diterima'].includes(status);
    }).length;

    const stats = {
        total: totalAktif,
        pending: orderMasuk.length,
        shipped: orderDikirim.length,
    };

    const recentOrders = [...filteredOrders]
        .filter(o => normalize(o.status) === 'pending')
        .sort((a, b) => parseDate(b.orderDate) - parseDate(a.orderDate));

    return {
        layoutProps: {
            menuItems: agenMenuItems,
            activeLabel: 'Dashboard',
            onNavigate: handleNavigation,
            showDropdown,
            toggleDropdown: () => setShowDropdown((prev) => !prev),
        },
        orders: filteredOrders,
        summaryCards,
        stats,
        recentOrders,
        loading,
        error: null,
    };
};
