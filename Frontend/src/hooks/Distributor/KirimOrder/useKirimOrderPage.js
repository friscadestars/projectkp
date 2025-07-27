// src/hooks/Distributor/KirimOrder/useKirimOrderPage.js

import { useState } from 'react';
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import { useOrder } from '../../../Context/OrderContext';
import kirimOrderIcon from '../../../assets/IconHeader/KirimOrderIcon.png';

export const useKirimOrderPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { handleNavigation } = useNavigation(distributorMenuItems);
    const { orders } = useOrder();

    const approvedOrders = orders
        .filter(order => order.status === 'approved') // ✅ Sudah dinormalisasi dari context
        .filter(order =>
            order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.agentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.distributor?.toLowerCase().includes(searchTerm.toLowerCase())
        );


    return {
        searchTerm,
        setSearchTerm,
        approvedOrders,
        layoutProps: {
            menuItems: distributorMenuItems,
            activeLabel: 'Kirim Order ke Pabrik',
            onNavigate: handleNavigation
        },
        pageTitleProps: {
            icon: kirimOrderIcon,
            title: 'Kirim Orderan ke Pabrik'
        }
    };
};
