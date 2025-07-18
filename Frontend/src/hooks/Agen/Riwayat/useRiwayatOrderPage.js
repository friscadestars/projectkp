import useRiwayatOrder from './useRiwayatOrder';
import { agenMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import Iconriwayat from '../../../assets/IconHeader/IconRiwayat.png';
import { useNavigation } from '../../useNavigation';

export const useRiwayatOrderPage = () => {
    const {
        showDropdown,
        setShowDropdown,
        handleDelete,
        handleDetail,
        completedOrders
    } = useRiwayatOrder();

    const { handleNavigation } = useNavigation(agenMenuItems);

    return {
        layoutProps: {
            menuItems: agenMenuItems,
            activeLabel: "Riwayat Order",
            onNavigate: handleNavigation,
            showDropdown,
            toggleDropdown: () => setShowDropdown(!showDropdown)
        },
        pageHeaderProps: {
            icon: Iconriwayat,
            title: "Riwayat Order"
        },
        orderTableProps: {
            orders: completedOrders,
            onDelete: handleDelete,
            onDetail: handleDetail
        }
    };
};
