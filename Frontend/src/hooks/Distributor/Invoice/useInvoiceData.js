import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const useInvoiceData = (url, fallbackPath = '/') => {
    const { state } = useLocation();
    const { id: invoiceIdFromUrl } = useParams();
    const navigate = useNavigate();

    const [invoiceData, setInvoiceData] = useState(null);
    const [statusPembayaran, setStatusPembayaran] = useState('Belum Lunas');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchDetailById = async (id) => {
            const token = localStorage.getItem('token');

            try {
                const res = await fetch(`${BASE_URL}/invoices/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Invoice tidak ditemukan');

                const { invoice, items } = await res.json();
                const status = invoice.status?.toLowerCase();
                const pembayaranStatus = ['lunas', 'paid'].includes(status) ? 'Lunas' : 'Belum Lunas';

                const mappedItems = items.map(item => ({
                    ...item,
                    name: item.nama || item.name || '-',
                    unitPrice: item.unit_price || item.unitPrice || 0,
                    quantity: item.quantity || 0,
                    subtotal: (item.unit_price || item.unitPrice || 0) * (item.quantity || 0),
                    isTotalRow: true,
                }));

                const pengirim = invoice.pengirim_bank || {
                    nama_bank: '-',
                    nama_rekening: '-',
                    rekening: '-',
                };

                // Ambil data order
                let fullOrder = null;
                const orderId = invoice.order_id;
                if (orderId) {
                    const resOrder = await fetch(`${BASE_URL}/orders/${orderId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (resOrder.ok) {
                        fullOrder = await resOrder.json();
                    }
                }

                // Ambil data agen
                let agen = null;
                if (fullOrder?.agen_id) {
                    const resAgen = await fetch(`${BASE_URL}/users/${fullOrder.agen_id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (resAgen.ok) {
                        const { name } = await resAgen.json();
                        agen = { name };
                    }
                }

                // Ambil data distributor
                let distributor = null;
                if (fullOrder?.distributor_id) {
                    const resDistributor = await fetch(`${BASE_URL}/users/${fullOrder.distributor_id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (resDistributor.ok) {
                        const { name } = await resDistributor.json();
                        distributor = { name };
                    }
                }

                const finalData = {
                    ...invoice,
                    invoice_number: invoice.invoice_number,
                    invoice_date: invoice.invoice_date,
                    invoice: {
                        ...invoice,
                        invoice_number: invoice.invoice_number,
                        invoice_date: invoice.invoice_date,
                    },
                    orderId: fullOrder?.id || invoice.order_id,
                    orderCode: fullOrder?.order_code || invoice.order_code || null,
                    orderDate: fullOrder?.order_date || invoice.order_date || null,
                    agenName: agen?.name || '-',
                    distributorName: distributor?.name || '-',
                    agen_name: agen?.name || '-',
                    distributor_name: distributor?.name || '-',
                    order: fullOrder,
                    items: mappedItems,
                    products: mappedItems,
                    pengirim_bank: pengirim,
                    status: invoice.status || pembayaranStatus,
                    statusPembayaran: pembayaranStatus,
                };

                setInvoiceData(finalData);
                setStatusPembayaran(pembayaranStatus);
            } catch (err) {
                console.error('Gagal memuat detail invoice:', err);
                navigate(fallbackPath, { replace: true });
            }
        };

        const fetchInvoiceByOrderCode = async () => {
            try {
                const distributorId = localStorage.getItem('distributor_id');
                const token = localStorage.getItem('token');

                if (!distributorId || !token) {
                    navigate(fallbackPath, { replace: true });
                    return;
                }

                const ordersRes = await fetch(
                    `${BASE_URL}/orders/byDistributor/${distributorId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!ordersRes.ok) throw new Error('Gagal ambil data order');
                const orders = await ordersRes.json();
                const matchedOrder = orders.find(
                    (o) => o.order_code?.toLowerCase() === invoiceIdFromUrl?.toLowerCase()
                );

                if (!matchedOrder) {
                    console.warn('Order tidak ditemukan dari kode:', invoiceIdFromUrl);
                    navigate(fallbackPath, { replace: true });
                    return;
                }

                const orderId = matchedOrder.id;

                const invoicesRes = await fetch(
                    `${BASE_URL}/invoice/pabrik-ke-distributor/${distributorId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!invoicesRes.ok) throw new Error('Gagal ambil data invoice');

                const invoicesData = await invoicesRes.json();
                const invoices = invoicesData.invoices || [];

                const matchedInvoice = invoices.find(
                    (inv) => inv.order_id?.toString() === orderId.toString()
                );

                if (matchedInvoice?.invoice_id) {
                    fetchDetailById(matchedInvoice.invoice_id);
                } else {
                    console.warn('Invoice tidak ditemukan untuk order:', orderId);
                    navigate(fallbackPath, { replace: true });
                }
            } catch (err) {
                console.error('Error:', err);
                navigate(fallbackPath, { replace: true });
            }
        };

        if (state?.tagihan?.id) {
            fetchDetailById(state.tagihan.id);
        } else if (invoiceIdFromUrl) {
            fetchInvoiceByOrderCode();
        }

    }, [state, invoiceIdFromUrl, fallbackPath, navigate]);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleKonfirmasi = async () => {
        const token = localStorage.getItem('token');
        const invoiceId = invoiceData?.id;

        if (!invoiceId) return;

        try {
            const res = await fetch(`${BASE_URL}/invoices/${invoiceId}/konfirmasi-pembayaran`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'paid' }),
            });

            if (!res.ok) throw new Error('Gagal memperbarui status pembayaran');

            setInvoiceData(prev => ({
                ...prev,
                status: 'paid',
                statusPembayaran: 'Lunas',
            }));
            setStatusPembayaran('Lunas');
        } catch (err) {
            console.error('Gagal konfirmasi pembayaran:', err);
        } finally {
            closeModal();
        }
    };

    return {
        invoiceData,
        statusPembayaran,
        showModal,
        openModal,
        closeModal,
        handleKonfirmasi,
    };
};

export default useInvoiceData;
