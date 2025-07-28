import { useEffect, useState } from 'react';
import { agenMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';
import iconTagihan from '../../../assets/IconHeader/IconTagihan.png';
import { useNavigation } from '../../useNavigation';
import useTagihanPage from './useTagihanPage';
import { fetchOrdersForBilling } from '../../../services/ordersApi';

export const useTagihanPageProps = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        showDropdown,
        toggleDropdown,
        searchTerm,
        setSearchTerm
    } = useTagihanPage();

    const { handleNavigation } = useNavigation(agenMenuItems);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchOrdersForBilling();
                if (mounted) setOrders(data);
            } catch (e) {
                if (mounted) setError(e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    return {
        layoutProps: {
            menuItems: agenMenuItems,
            activeLabel: 'Tagihan',
            onNavigate: handleNavigation,
            showDropdown,
            toggleDropdown
        },
        pageHeaderProps: {
            icon: iconTagihan,
            title: 'Tagihan Anda'
        },
        searchInputProps: {
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder: 'Cari Order ID / Distributor / Status'
        },
        tagihanTableProps: {
            orders,
            searchTerm,
            role: 'agen'
        },
        loading,
        error
    };
};