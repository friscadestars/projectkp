import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import iconValidasi from '../../../assets/IconHeader/ValidasiIcon.png';
import { fetchOrderById, updateOrderStatus, updateOrderItemPrice, fetchPabrikPrices } from '../../../services/ordersApi';

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
                const pabrikPrices = await fetchPabrikPrices();
                const normalizeStatus = (status) => {
                    const map = {
                        pending: 'Tertunda',
                        approved: 'Disetujui',
                        cancelled: 'Ditolak',
                        shipped: 'Dikirim',
                        processed: 'Diproses',
                        received: 'Diterima',
                    };
                    return map[status?.toLowerCase()] || status;
                };
                const mappedOrder = {
                    orderId: fetchedOrder.orderId,
                    orderCode: fetchedOrder.orderCode,
                    agenId: fetchedOrder.agenName ?? 'Nama tidak ditemukan',
                    alamat: fetchedOrder.alamat ?? '-',
                    orderDate: fetchedOrder.orderDate,
                    status: fetchedOrder.status,
                    products: (fetchedOrder.products ?? []).map((p) => ({
                        name: p.name,
                        quantity: p.quantity,
                        requestedPrice: p.requestedPrice ?? 0,
                        unitPrice: pabrikPrices[p.name.toLowerCase().trim()] ?? 0,
                    })),
                };

                setOrder(mappedOrder);

                setInputPrices(
                    mappedOrder.products.map((p) => ({
                        name: p.name,
                        price: p.unitPrice || '',
                    }))
                );
            } catch (e) {
                console.error('Gagal memuat order:', e?.message ?? e);
                Swal.fire('Gagal memuat order', e?.message ?? 'Terjadi kesalahan', 'error');
            }
        })();
    }, [orderId]);

    const handleSetHarga = (index, value) => {
        const updated = [...inputPrices];
        if (!updated[index]) {
            updated[index] = {};
        }
        updated[index].price = value;
        setInputPrices(updated);
    };

    const handleKirim = async () => {
        try {
            // Update harga tiap item
            for (let i = 0; i < inputPrices.length; i++) {
                const item = inputPrices[i];
                const price = parseInt(String(item.price).replace(/[^\d]/g, ''), 10);
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
                navigate('/distributor/monitoring-order');
            });
        } catch (e) {
            Swal.fire('Gagal', e?.message ?? 'Terjadi kesalahan', 'error');
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
            Swal.fire('Gagal menolak order', e?.message ?? 'Terjadi kesalahan', 'error');
        }
    };

    return {
        order,
        inputPrices,
        handleSetHarga,
        handleKirim,
        handleTolak,
        layoutProps: {
            menuItems: distributorMenuItems,
            activeLabel: 'Validasi Order',
            onNavigate: handleNavigation,
        },
        pageTitleProps: {
            icon: iconValidasi,
            title: 'Validasi Order',
        },
    };
};
