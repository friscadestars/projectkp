// src/hooks/Distributor/useValidasiOrderPage.js
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2
import { useOrder } from '../../../Context/OrderContext';
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';
import iconValidasi from '../../../assets/IconHeader/ValidasiIcon.png';

export const useValidasiOrderPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders, updateProductPrice } = useOrder();
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
        inputPrices.forEach(p => {
            const numeric = parseInt(p.price);
            if (!isNaN(numeric)) {
                updateProductPrice(orderId, p.name, numeric);
            }
        });

        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `Order ${orderId} berhasil disetujui.`,
            confirmButtonColor: '#3085d6',
        }).then(() => {
            navigate('/distributor/validasi-order');
        });
    };

    const handleTolak = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Ditolak',
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
