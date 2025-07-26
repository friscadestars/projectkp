import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import iconValidasi from '../../../assets/IconHeader/ValidasiIcon.png';
import { fetchOrderById, updateOrderStatus, updateOrderItemPrice } from '../../../services/ordersApi';

export const useValidasiOrderPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { handleNavigation } = useNavigation(distributorMenuItems);

    const [order, setOrder] = useState(null);
    const [inputPrices, setInputPrices] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const fetchedOrder = await fetchOrderById(orderId);
                setOrder(fetchedOrder);
                setInputPrices(
                    fetchedOrder.items.map(p => ({
                        name: p.product_name,
                        price: p.unit_price || '',
                    }))
                );
            } catch (e) {
                console.error('Gagal memuat order:', e.message);
            }
        })();
    }, [orderId]);

    const handleSetHarga = (index, value) => {
        const updated = [...inputPrices];
        updated[index].price = value;
        setInputPrices(updated);
    };

    const handleTerima = async () => {
        try {
            for (let i = 0; i < inputPrices.length; i++) {
                const item = inputPrices[i];
                const price = parseInt(item.price);
                if (!isNaN(price)) {
                    await updateOrderItemPrice(orderId, item.name, price);
                }
            }

            await updateOrderStatus(orderId, 'approved');

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: `Order ${orderId} disetujui.`,
                confirmButtonColor: '#3085d6',
            }).then(() => {
                navigate('/distributor/kirim-order');
            });
        } catch (e) {
            Swal.fire('Gagal', e.message, 'error');
        }
    };

    const handleTolak = async () => {
        try {
            await updateOrderStatus(orderId, 'cancelled');
            Swal.fire({
                icon: 'info',
                title: 'Order Ditolak',
                text: `Order ${orderId} telah ditolak.`,
                confirmButtonColor: '#d33',
            }).then(() => {
                navigate('/distributor/validasi-order');
            });
        } catch (e) {
            Swal.fire('Gagal menolak order', e.message, 'error');
        }
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
            onNavigate: handleNavigation,
        },
        pageTitleProps: {
            icon: iconValidasi,
            title: 'Validasi Order',
        }
    };
};
