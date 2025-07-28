// src/hooks/Agen/DetailOrder/useDetailOrderPage.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigation } from '../../useNavigation';
import { agenMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';
import { getOrderPageInfo } from '../../../utils/Agen/InfoDetailOrder';
import { fetchOrderDetailById } from '../../../services/ordersApi'; // PAKAI YANG INI

export const useDetailOrderPage = () => {
    const { orderId } = useParams(); // ambil ID dari URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(agenMenuItems);
    const { titleText, icon, activeLabel } = getOrderPageInfo('ringkasan-order');

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                setLoading(true);
                const result = await fetchOrderDetailById(orderId);
                if (mounted) setOrder(result);
            } catch (e) {
                if (mounted) setErr(e);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, [orderId]);

    return {
        order,
        loading,
        error: err,
        titleText,
        icon,
        activeLabel,
        showDropdown,
        toggleDropdown: () => setShowDropdown(prev => !prev),
        handleNavigation,
        agenMenuItems,
    };
};
