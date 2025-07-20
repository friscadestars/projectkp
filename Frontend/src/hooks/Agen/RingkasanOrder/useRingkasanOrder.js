// src/hooks/Agen/useRingkasanOrder.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../../Context/OrderContext';
import { agenMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../useNavigation';

const useRingkasanOrder = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const { orders, setOrders } = useOrder();
    const navigate = useNavigate();
    const { handleNavigation } = useNavigation(agenMenuItems);

    const handleDetail = (order) => {
        navigate('/agen/detail-order', { state: { order, from: 'ringkasan' } });
    };

    const handleConfirm = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const confirmReceipt = () => {
        const updated = orders.map(order => {
            if (order.id === selectedId && order.status === 'Dikirim') {
                const total = order.products.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
                return {
                    ...order,
                    status: 'Selesai',
                    receivedDate: new Date().toLocaleDateString('id-ID'),
                    total,
                };
            }
            return order;
        });

        setOrders(updated);
        setShowModal(false);
        setSelectedId(null);
    };

    const cancelReceipt = () => {
        setShowModal(false);
        setSelectedId(null);
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Tertunda':
                return 'bg-yellow-400 text-white font-bold';
            case 'Disetujui':
                return 'bg-green-500 text-white font-bold';
            case 'Diproses':
                return 'bg-blue-500 text-white font-bold';
            case 'Ditolak':
                return 'bg-red-500 text-white font-bold';
            case 'Dikirim':
                return 'bg-[#17A2B8] text-white font-bold';
            case 'Selesai':
                return 'bg-green-700 text-white font-bold';
            default:
                return '';
        }
    };

    const getEstimatedDate = (order) => {
        if (order.status !== 'Dikirim' || !order.orderDate) return '-';
        const [day, month, year] = order.orderDate.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        date.setDate(date.getDate() + 3);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    const parseDate = (date) => {
        if (!date || date === '-') return new Date(0);
        const [d, m, y] = date.split('/').map(Number);
        return new Date(y, m - 1, d);
    };

    // Filter status yang diizinkan ditampilkan
    const allowedStatuses = ['Tertunda', 'Disetujui', 'Diproses', 'Ditolak', 'Dikirim'];

    const filteredOrders = orders
        .filter(order =>
            allowedStatuses.includes(order.status) &&
            (
                (order.orderId && order.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (order.distributor && order.distributor.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (order.status && order.status.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        )
        .sort((a, b) => {
            const dateA = parseDate(a.orderDate);
            const dateB = parseDate(b.orderDate);
            return dateB - dateA || parseInt(b.orderId?.split('-')[1] || 0) - parseInt(a.orderId?.split('-')[1] || 0);
        });

    return {
        searchTerm,
        setSearchTerm,
        showModal,
        showDropdown,
        setShowDropdown,
        filteredOrders,
        handleNavigation,
        handleDetail,
        handleConfirm,
        confirmReceipt,
        cancelReceipt,
        getStatusClasses,
        getEstimatedDate,
    };
};

export default useRingkasanOrder;
