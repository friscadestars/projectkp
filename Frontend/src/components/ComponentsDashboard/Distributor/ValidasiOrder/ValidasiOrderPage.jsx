import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../../../../Context/OrderContext';
import ValidasiOrderContent from './DetailOrderContent';

const ValidasiOrderPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders, approveOrder } = useOrder();

    const order = orders.find(order => order.orderId === orderId);
    const [inputPrices, setInputPrices] = useState({});

    const handleSetHarga = (productName, price) => {
        setInputPrices(prev => ({ ...prev, [productName]: price }));
    };

    const handleTerima = () => {
        approveOrder(orderId); // ✅ ubah status
        navigate('/distributor/kirim-ke-pabrik'); // ✅ pindah ke halaman kirim
    };

    const handleTolak = () => {
        // opsional jika ada rejectOrder di context
    };

    return (
        <ValidasiOrderContent
            order={order}
            inputPrices={inputPrices}
            handleSetHarga={handleSetHarga}
            handleTerima={handleTerima}
            handleTolak={handleTolak}
            pageTitleProps={{ title: 'Validasi Order', icon: '📦' }}
        />
    );
};

export default ValidasiOrderPage;
