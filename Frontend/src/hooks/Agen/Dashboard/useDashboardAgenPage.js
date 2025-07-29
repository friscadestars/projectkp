// src/hooks/Agen/Dashboard/useDashboardAgenPage.js
import { useMemo, useState } from 'react';
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
    const { orders } = useOrder();
    const { handleNavigation } = useNavigation(agenMenuItems);
    const [showDropdown, setShowDropdown] = useState(false);

    let user = {};
    try {
        const stored = localStorage.getItem('user');
        user = stored ? JSON.parse(stored) : {};
    } catch {
        user = {};
    }

    const agenId = Number(user?.id);

    // Filter orders hanya milik agen
    const agenOrders = useMemo(() => {
        return (orders || []).filter(order =>
            Number(order.agentId) === agenId // ✅ hanya pakai agentId dari mapOrder
        );
    }, [orders, agenId]);

    const orderMasuk = agenOrders.filter((o) =>
        normalize(o.status) === 'pending'
    );


    const orderDikirim = agenOrders.filter((o) =>
        normalize(o.status) === 'shipped'
    );

    const orderSelesai = agenOrders.filter((o) => {
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

    const totalAktif = agenOrders.filter((o) => {
        const status = normalize(o.status);
        return !['delivered', 'diterima'].includes(status);
    }).length;

    const stats = {
        total: totalAktif,
        pending: orderMasuk.length,
        shipped: orderDikirim.length,
    };

    const recentOrders = [...agenOrders]
        .filter(o => normalize(o.status) === 'pending')
        .sort((a, b) => parseDate(b.orderDate) - parseDate(a.orderDate));

    console.log('🧾 orders dari context:', orders);
    console.log('🔑 agenId dari user login:', agenId);

    return {
        layoutProps: {
            menuItems: agenMenuItems,
            activeLabel: 'Dashboard',
            onNavigate: handleNavigation,
            showDropdown,
            toggleDropdown: () => setShowDropdown((prev) => !prev),
        },
        orders: agenOrders,
        summaryCards,
        stats,
        recentOrders,
        loading: false,
        error: null,
    };
};
