// src/Components/ComponentsDashboard/Common/SendOrderButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useOrder } from '../../../Context/OrderContext'; // ✅ Ambil context

const SendOrderButton = ({ orderId }) => {
    const navigate = useNavigate();
    const { updateOrderStatus } = useOrder(); // ✅ Ambil fungsi update status

    const handleClick = () => {
        Swal.fire({
            title: 'Konfirmasi Pengiriman',
            text: `Apakah Anda yakin ingin mengirim order ${orderId} ke pabrik?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Kirim',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // ✅ Ubah status menjadi 'Tertunda' untuk order masuk di pabrik
                updateOrderStatus(orderId, 'Tertunda');

                Swal.fire({
                    icon: 'success',
                    title: 'Order Dikirim',
                    text: `Order ${orderId} berhasil dikirim ke pabrik.`,
                    confirmButtonColor: '#2563eb',
                }).then(() => {
                    navigate('/distributor/kirim-order');
                });
            }
        });
    };

    return (
        <button
            onClick={handleClick}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded text-sm"
        >
            Kirim
        </button>
    );
};

export default SendOrderButton;
