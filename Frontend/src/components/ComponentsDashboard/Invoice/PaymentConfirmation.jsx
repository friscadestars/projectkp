import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

const PaymentConfirmation = ({ onConfirm }) => {
    useEffect(() => {
        const showConfirmation = async () => {
            const result = await Swal.fire({
                title: 'Konfirmasi Pembayaran',
                text: 'Apakah Anda yakin ingin mengonfirmasi pembayaran?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#16a34a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Konfirmasi',
                cancelButtonText: 'Batal',
            });

            if (result.isConfirmed) {
                onConfirm();
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Pembayaran telah dikonfirmasi.',
                    icon: 'success',
                    confirmButtonColor: '#2563eb',
                });
            }
        };

        showConfirmation(); // otomatis tampil saat komponen dirender
    }, [onConfirm]);

    return null; // tidak merender apa-apa karena SweetAlert sudah tampil sebagai modal
};

export default PaymentConfirmation;
