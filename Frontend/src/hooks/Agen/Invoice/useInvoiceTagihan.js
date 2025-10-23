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

    const mapStatusToLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'lunas':
            case 'dibayar':
                return 'Lunas';
            case 'waiting_confirmation':
                return 'Menunggu Validasi';
            case 'unpaid':
            default:
                return 'Belum Lunas';
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('⚠️ Token tidak ditemukan di localStorage');
                return;
            }
            if (location.state?.tagihan) {
                const tagihan = location.state.tagihan;
                const statusPembayaran = mapStatusToLabel(tagihan.status);

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
                            pengirim = userJson && userJson.id ? userJson : null;
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
                        : null
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

                    const statusPembayaran = mapStatusToLabel(invoice.status);

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
            const response = await fetch(
                `http://localhost:8080/api/invoices/${invoiceData.tagihan.id}/confirm-payment`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal konfirmasi');
            }

            const result = await response.json();

            setInvoiceData(prevData => {
                if (!prevData) return null;

                const backendStatus = result.status || prevData.tagihan.status;
                return {
                    ...prevData,
                    tagihan: {
                        ...prevData.tagihan,
                        status: backendStatus,
                    },
                    statusPembayaran: mapStatusToLabel(backendStatus),
                };
            });

            setStatusPembayaran(mapStatusToLabel(result.status));

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
