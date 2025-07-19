// src/hooks/Distributor/useValidasiOrderPage.js
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import { useOrder } from '../../../Context/OrderContext'; // ✅ Import hanya sekali
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';
import iconValidasi from '../../../assets/IconHeader/ValidasiIcon.png';

export const useValidasiOrderPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders, updateProductPrice, updateOrderStatus } = useOrder(); // ✅ Gunakan dengan benar
    const { handleNavigation } = useNavigation(distributorMenuItems);

    const order = orders.find(o => o.orderId === orderId);

    const [inputPrices, setInputPrices] = useState(
        order?.products.map(p => ({ name: p.name, price: '' })) || []
    );

    const handleSetHarga = (index, value) => {
        const updated = [...inputPrices];
        updated[index].price = value;
        setInputPrices(updated);
    };

    const handleTerima = () => {
        if (!order) return;

        inputPrices.forEach(p => {
            const numeric = parseInt(p.price);
            if (!isNaN(numeric)) {
                updateProductPrice(orderId, p.name, numeric); // ✅ Update harga
            }
        });

        updateOrderStatus(orderId, 'Disetujui'); // ✅ Update status

        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `Order ${orderId} berhasil disetujui dan akan dikirim ke pabrik.`,
            confirmButtonColor: '#3085d6',
        }).then(() => {
            navigate('/distributor/kirim-order');
        });
    };

    const handleTolak = () => {
        if (!order) return;

        updateOrderStatus(orderId, 'Ditolak'); // ✅ Update status

        Swal.fire({
            icon: 'info',
            title: 'Order Ditolak',
            text: `Order ${orderId} telah ditolak.`,
            confirmButtonColor: '#d33',
        }).then(() => {
            navigate('/distributor/validasi-order');
        });
    };

    return {
        order,
        inputPrices,
        handleSetHarga,
        handleTerima,
        handleTolak,
        layoutProps: {
            menuItems: distributorMenuItems,
            activeLabel: 'Validasi Order',
            onNavigate: handleNavigation
        },
        pageTitleProps: {
            icon: iconValidasi,
            title: 'Validasi Order'
        }
    };
};
