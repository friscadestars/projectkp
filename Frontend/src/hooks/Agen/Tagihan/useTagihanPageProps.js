import { useOrder } from '../../../Context/OrderContext';
import { agenMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import iconTagihan from '../../../assets/IconHeader/IconTagihan.png';
import { useNavigation } from '../../useNavigation';
import useTagihanPage from './useTagihanPage';

export const useTagihanPageProps = () => {
    const { orders, updateOrderStatus } = useOrder(); // pastikan fungsi ini ada di context
    const {
        showDropdown,
        toggleDropdown,
        searchTerm,
        setSearchTerm
    } = useTagihanPage();

    const { handleNavigation } = useNavigation(agenMenuItems);

    // Fungsi untuk handle perubahan status (misal: dari "Belum Bayar" ke "Lunas")
    const handleStatusChange = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
    };

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
            placeholder: 'Cari Order ID'
        },
        tagihanTableProps: {
            orders,
            searchTerm,
            onStatusChange: handleStatusChange // 🟢 Tambahkan handler ke props table
        }
    };
};
