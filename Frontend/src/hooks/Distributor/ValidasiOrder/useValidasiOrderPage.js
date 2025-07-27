import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import iconValidasi from '../../../assets/IconHeader/ValidasiIcon.png';
import { fetchOrderById, updateOrderStatus, updateOrderItemPrice, fetchPabrikPrices } from '../../../services/ordersApi';

export const useValidasiOrderPage = () => {
    const { orderId } = useParams(); // <-- ini ID numerik (string)
    const navigate = useNavigate();
    const { handleNavigation } = useNavigation(distributorMenuItems);

    const [order, setOrder] = useState(null);
    const [inputPrices, setInputPrices] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const fetchedOrder = await fetchOrderById(orderId); // dari order_items
                const pabrikPrices = await fetchPabrikPrices(); // dari tabel product_prices
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
                        unitPrice: pabrikPrices[p.name] ?? 0, // Ganti jadi dari daftar harga pabrik
                    })),
                };

                setOrder(mappedOrder);

                setInputPrices(
                    mappedOrder.products.map((p) => ({
                        name: p.name,
                        price: p.unitPrice || '', // tetap isi dari harga pabrik
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
        updated[index].price = value;
        setInputPrices(updated);
    };

    const handleTerima = async () => {
        try {
            // Update harga tiap item
            for (let i = 0; i < inputPrices.length; i++) {
                const item = inputPrices[i];
                const price = parseInt(String(item.price).replace(/[^\d]/g, ''), 10);
                if (!isNaN(price)) {
                    await updateOrderItemPrice(orderId, item.name, price); // <-- pakai ID
                }
            }

            await updateOrderStatus(orderId, 'approved'); // <-- pakai ID

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: `Order ${orderId} disetujui.`,
                confirmButtonColor: '#3085d6',
            }).then(() => {
                navigate('/distributor/kirim-order');
            });
        } catch (e) {
            Swal.fire('Gagal', e?.message ?? 'Terjadi kesalahan', 'error');
        }
    };

    const handleTolak = async () => {
        try {
            await updateOrderStatus(orderId, 'cancelled'); // <-- pakai ID
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
        },
    };
};
