// src/hooks/Agen/useRiwayatOrder.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../Context/OrderContext';
import { agenMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../useNavigation';

const useRiwayatOrder = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const { orders, setOrders } = useOrder();

    const { handleNavigation } = useNavigation(agenMenuItems);

    const handleDelete = (id) => {
        const confirmed = window.confirm("Apakah Anda yakin ingin menghapus riwayat order ini?");
        if (confirmed) {
            const updatedOrders = orders.filter(order => order.id !== id);
            setOrders(updatedOrders);
        }
    };

    const handleDetail = (order) => {
        navigate('/agen/detail-order', { state: { order, from: 'riwayat' } });
    };

    const completedOrders = orders.filter(order => order.status === 'Selesai');

    return {
        showDropdown,
        setShowDropdown,
        handleNavigation,
        handleDelete,
        handleDetail,
        completedOrders
    };
};

export default useRiwayatOrder;
