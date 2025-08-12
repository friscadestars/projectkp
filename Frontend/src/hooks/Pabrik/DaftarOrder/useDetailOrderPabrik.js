import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { updateOrderStatus } from '../../../services/ordersApi';

export const useDetailOrderPabrik = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [order, setOrder] = useState(location.state?.order || null);

    const mulaiProduksi = async () => {
        if (!order) return;

        const result = await Swal.fire({
            title: 'Konfirmasi Produksi',
            text: 'Apakah Anda yakin ingin memulai produksi?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Mulai',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
        });

        if (result.isConfirmed) {
            try {
                // ✅ Update ke backend dengan status 'processing'
                await updateOrderStatus(order.orderId, 'processing');

                // ✅ Update state lokal untuk UI
                const updatedOrder = {
                    ...order,
                    status: 'Sedang Diproduksi',
                };

                setOrder(updatedOrder);

                // Refresh halaman dengan state baru
                navigate('/pabrik/detail-order', { state: { order: updatedOrder } });
            } catch (error) {
                Swal.fire('Gagal', error.message || 'Gagal mengupdate status order.', 'error');
            }
        }
    };

    return {
        order,
        mulaiProduksi,
    };
};
