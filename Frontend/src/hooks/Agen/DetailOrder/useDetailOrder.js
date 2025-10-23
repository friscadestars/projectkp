import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigation } from '../../useNavigation';
import { agenMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';
import { getOrderPageInfo } from '../../../utils/Agen/InfoDetailOrder';
import { fetchOrderDetailById } from '../../../services/ordersApi';

export const useDetailOrderPage = () => {
    const { id } = useParams();
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

                const result = await fetchOrderDetailById(id);

                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const agenId = user?.id;

                console.log('DEBUG: agentId dari order:', result.agentId);
                console.log('DEBUG: agenId dari localStorage:', agenId);
                console.log('🎯 result dari fetchOrderDetailById:', result);

                if (Number(result.agentId) !== Number(agenId)) {
                    throw new Error('Anda tidak memiliki akses ke order ini.');
                }

                if (mounted) setOrder(result);
            } catch (e) {
                if (mounted) {
                    setErr(e);
                    setOrder(null);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, [id]);

    return {
        order,
        loading,
        error: err,
        titleText,
        icon,
        activeLabel,
        showDropdown,
        toggleDropdown: () => setShowDropdown((prev) => !prev),
        handleNavigation,
        agenMenuItems,
    };
};
