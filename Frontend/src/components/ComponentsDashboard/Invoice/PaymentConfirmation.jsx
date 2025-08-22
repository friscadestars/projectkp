import { confirmPaymentByAgent, fetchOrderById } from '/src/services/ordersApi.js';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

const PaymentConfirmation = ({ invoiceId, onSuccess, setInvoiceData }) => {
    useEffect(() => {
        const showConfirmation = async () => {
            const result = await Swal.fire({
                title: 'Konfirmasi Pembayaran',
                text: 'Apakah Anda yakin sudah melakukan pembayaran?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#16a34a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Konfirmasi',
                cancelButtonText: 'Batal',
            });

            if (result.isConfirmed) {
                try {
                    // Panggil API konfirmasi pembayaran
                    await confirmPaymentByAgent(invoiceId);

                    // Update state lokal jadi "menunggu validasi"
                    if (setInvoiceData) {
                        setInvoiceData(prev => ({
                            ...prev,
                            tagihan: {
                                ...prev.tagihan,
                                status: 'waiting_confirmation',
                            },
                            statusPembayaran: 'Menunggu Validasi',
                        }));
                    }

                    Swal.fire({
                        title: 'Menunggu Validasi',
                        text: 'Pembayaran Anda sedang menunggu validasi dari distributor.',
                        icon: 'info',
                        confirmButtonColor: '#2563eb',
                    });

                    // callback tambahan
                    onSuccess?.();
                } catch (err) {
                    Swal.fire('Gagal', err.message, 'error');
                }
            }
        };

        showConfirmation();
    }, [invoiceId, onSuccess, setInvoiceData]);

    return null;
};

export default PaymentConfirmation;
