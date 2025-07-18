// src/hooks/Agen/useRingkasanOrderPage.js
import truckIcon from '../../../assets/IconHeader/IconTruck.png';
import { agenMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../useNavigation';
import useRingkasanOrder from './useRingkasanOrder';

export const useRingkasanOrderPage = () => {
    const {
        searchTerm, setSearchTerm,
        showDropdown, setShowDropdown,
        showModal, filteredOrders,
        handleDetail, handleConfirm,
        confirmReceipt, cancelReceipt,
        getStatusClasses, getEstimatedDate
    } = useRingkasanOrder();

    const { handleNavigation } = useNavigation(agenMenuItems);

    return {
        layoutProps: {
            menuItems: agenMenuItems,
            activeLabel: 'Ringkasan Order',
            onNavigate: handleNavigation,
            showDropdown,
            toggleDropdown: () => setShowDropdown(!showDropdown)
        },
        pageHeaderProps: {
            icon: truckIcon,
            title: 'Ringkasan Order'
        },
        searchInputProps: {
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
        },
        orderTableProps: {
            orders: filteredOrders,
            onDetail: handleDetail,
            onConfirm: handleConfirm,
            getStatusClasses,
            getEstimatedDate
        },
        confirmationModalProps: {
            onConfirm: confirmReceipt,
            onCancel: cancelReceipt
        },
        showModal
    };
};
