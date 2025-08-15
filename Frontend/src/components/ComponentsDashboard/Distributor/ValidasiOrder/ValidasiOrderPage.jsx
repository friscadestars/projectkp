// src/Components/ComponentsDashboard/Distributor/ValidasiOrder/ValidasiOrderPage.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../../../../Context/OrderContext';
import ValidasiOrderContent from './DetailOrderContent';
import { updateOrderStatus } from '../../../../services/ordersApi';

const ValidasiOrderPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders, approveOrder } = useOrder();

    const pendingOrders = orders.filter(order => order.status?.toLowerCase() === 'pending');
    const order = pendingOrders.find(order => order.orderId === orderId);
    const [inputPrices, setInputPrices] = useState({});

    const handleSetHarga = (productName, price) => {
        setInputPrices(prev => ({ ...prev, [productName]: price }));
    };

    const handleKirim = async () => {
        try {
            await updateOrderStatus(orderId, 'approved');
            await approveOrder(orderId);

            await Swal.fire({
                icon: 'success',
                title: 'Order Disetujui',
                text: `Order berhasil dikirim ke pabrik`,
                confirmButtonColor: '#2563eb',
            });

            navigate('/distributor/monitoring-order');
        } catch (e) {
            console.error(e);
            Swal.fire('Gagal', 'Terjadi kesalahan saat mengirim order.', 'error');
        }
    };

    const handleTolak = () => {
        Swal.fire('Fitur belum tersedia', 'Penolakan order belum diimplementasikan.', 'info');
    };

    return (
        <ValidasiOrderContent
            order={order}
            inputPrices={inputPrices}
            handleSetHarga={handleSetHarga}
            handleKirim={handleKirim}
            handleTolak={handleTolak}
            pageTitleProps={{ title: 'Validasi Order', icon: '📦' }}
        />
    );
};

export default ValidasiOrderPage;
