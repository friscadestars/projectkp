import { useOrder } from '../../../Context/OrderContext';
import { agenMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import iconTagihan from '../../../assets/IconHeader/IconTagihan.png';
import { useNavigation } from '../../useNavigation';
import useTagihanPage from './useTagihanPage';

export const useTagihanPageProps = () => {
    const { orders } = useOrder();
    const {
        showDropdown,
        toggleDropdown,
        searchTerm,
        setSearchTerm
    } = useTagihanPage();

    const { handleNavigation } = useNavigation(agenMenuItems);

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
            searchTerm
        }
    };
};
