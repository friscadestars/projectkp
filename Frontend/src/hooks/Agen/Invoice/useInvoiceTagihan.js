// src/hooks/useInvoiceTagihan.js

import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchOrderById } from '/src/services/ordersApi';

const useInvoiceTagihan = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [invoiceData, setInvoiceData] = useState(null);
    const [statusPembayaran, setStatusPembayaran] = useState('Belum Lunas');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('⚠️ Token tidak ditemukan di localStorage');
                return;
            }
            if (location.state?.tagihan) {
                const tagihan = location.state.tagihan;
                const status = tagihan.status?.toLowerCase();
                const statusPembayaran = status === 'paid' ? 'Lunas' : 'Belum Lunas';

                // Ambil user pengirim (dari distributor_id atau pabrik_id)
                const senderId = tagihan.distributorId || tagihan.distributor_id;
                let pengirim = null;

                if (senderId) {
                    try {
                        const userRes = await fetch(`http://localhost:8080/api/users/${senderId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });

                        if (userRes.ok) {
                            const userJson = await userRes.json();
                            console.log('🔍 FULL USER JSON:', userJson);
                            pengirim = userJson && userJson.id ? userJson : null;
                            console.log('DATA PENGIRIM:', pengirim);
                        }
                    } catch (e) {
                        console.error('Gagal ambil pengirim:', e);
                    }
                }

                setInvoiceData({
                    ...tagihan,
                    statusPembayaran,
                    items: tagihan.items || [],
                    pengirim_bank: pengirim
                        ? {
                            nama_bank: pengirim.nama_bank,
                            nama_rekening: pengirim.nama_rekening,
                            rekening: pengirim.rekening
                        }
                        : null // ← SIMPAN DATA BANK DI SINI
                });

                setStatusPembayaran(statusPembayaran);
            } else if (id) {
                try {
                    const res = await fetch(`http://localhost:8080/api/invoices/${id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (!res.ok) throw new Error('Invoice tidak ditemukan');

                    const { invoice, order, items } = await res.json();

                    const status = invoice.status?.toLowerCase();
                    const statusPembayaran = ['lunas', 'paid', 'dibayar'].includes(status)
                        ? 'Lunas'
                        : 'Belum Lunas';

                    // Ambil user pengirim
                    const senderId = invoice.distributorId || invoice.distributor_id || invoice.pabrikId || invoice.pabrik_id;
                    let pengirim = null;

                    if (senderId) {
                        try {
                            const userRes = await fetch(`http://localhost:8080/api/users/${senderId}`, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            });

                            if (userRes.ok) {
                                const userJson = await userRes.json();
                                pengirim = userJson.data || null;
                            }
                        } catch (e) {
                            console.error('Gagal ambil pengirim:', e);
                        }
                    }

                    const processedData = {
                        ...order,
                        tagihan: {
                            ...invoice,
                            items: items
                        },
                        pengirim_bank: pengirim
                            ? {
                                nama_bank: pengirim.nama_bank,
                                nama_rekening: pengirim.nama_rekening,
                                rekening: pengirim.rekening
                            }
                            : null,
                        statusPembayaran
                    };

                    setInvoiceData(processedData);
                    setStatusPembayaran(statusPembayaran);
                } catch (err) {
                    console.error('Gagal ambil invoice:', err);
                    Swal.fire({
                        title: 'Error!',
                        text: `Gagal memuat invoice. ${err.message}`,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/agen/tagihan');
                    });
                }
            } else {
                navigate('/agen/tagihan');
            }
        };
        loadData();
    }, [location.state, id, navigate]);


    const handleConfirmPayment = async () => {
        try {
            if (!invoiceData?.tagihan?.id) return;

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/invoices/${invoiceData.tagihan.id}/confirm-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal konfirmasi');
            }

            const result = await response.json();

            // **PERBAIKAN UTAMA DI SINI:**
            // Update objek invoiceData dengan status yang baru
            setInvoiceData(prevData => {
                if (!prevData) return null;
                return {
                    ...prevData,
                    tagihan: {
                        ...prevData.tagihan,
                        status: 'paid'
                    },
                    statusPembayaran: 'Lunas'
                };
            });

            Swal.fire({
                title: 'Berhasil!',
                text: 'Pembayaran telah dikonfirmasi.',
                icon: 'success',
                confirmButtonColor: '#2563eb',
            });

        } catch (error) {
            console.error('Gagal konfirmasi pembayaran:', error);
            Swal.fire({
                title: 'Error!',
                text: `Gagal konfirmasi pembayaran. ${error.message}`,
                icon: 'error',
                confirmButtonColor: '#d33',
            });
        } finally {
            setShowModal(false);
        }
    };

    return {
        invoiceData,
        statusPembayaran,
        showDropdown,
        toggleDropdown: () => setShowDropdown(prev => !prev),
        handleConfirmPayment,
        showModal,
        openModal: () => setShowModal(true),
        closeModal: () => setShowModal(false)
    };
};

export default useInvoiceTagihan;