// src/hooks/Agen/Dashboard/useDashboardAgenPage.js
import { useEffect, useMemo, useState } from 'react';
import { fetchOrdersForDashboard } from '../../../services/ordersApi';
import { useNavigation } from '../../useNavigation';
import { agenMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';

const parseDate = (dateString) => {
    const [d, m, y] = (dateString || '').split('/').map(Number);
    return new Date(y || 0, (m || 1) - 1, d || 1);
};

export const useDashboardAgenPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(agenMenuItems);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                const data = await fetchOrdersForDashboard();
                if (!mounted) return;

                const sorted = [...data].sort((a, b) => {
                    const da = parseDate(a.orderDate);
                    const db = parseDate(b.orderDate);
                    if (db - da !== 0) return db - da;
                    const ida = parseInt(String(a.orderId).split('-')[1]) || 0;
                    const idb = parseInt(String(b.orderId).split('-')[1]) || 0;
                    return idb - ida;
                });

                setOrders(sorted);
            } catch (e) {
                if (mounted) setErr(e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    // Sekarang status sudah "Tertunda", "Dikirim", dll dari mapStatusToID()
    const stats = useMemo(() => {
        const pending = orders.filter((o) =>
            ['tertunda', 'pending'].includes(o.status.toLowerCase())
        ).length;
        const shipped = orders.filter((o) => o.status === 'Dikirim').length;
        return {
            total: orders.length,
            pending,
            shipped,
        };
    }, [orders]);

    const recentOrders = useMemo(
        () => orders.filter((o) =>
            ['tertunda', 'pending'].includes(o.status.toLowerCase())
        ),
        [orders]
    );


    console.log("ORDERS:", orders);

    return {
        // dipakai di Page
        layoutProps: {
            menuItems: agenMenuItems,
            activeLabel: 'Dashboard',
            onNavigate: handleNavigation,
            showDropdown,
            toggleDropdown: () => setShowDropdown((p) => !p),
        },

        // dipakai di Content
        orders,
        loading,
        error: err,
        stats,
        recentOrders,
    };
};
