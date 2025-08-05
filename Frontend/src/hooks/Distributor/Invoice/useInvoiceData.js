import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const useInvoiceData = (url, fallbackPath = '/') => {
    const { state } = useLocation();
    const { id: invoiceIdFromUrl } = useParams();
    const navigate = useNavigate();

    const [invoiceData, setInvoiceData] = useState(null);
    const [statusPembayaran, setStatusPembayaran] = useState('Belum Lunas');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const distributorId = localStorage.getItem('distributor_id');
                const token = localStorage.getItem('token');

                if (!distributorId || !token) {
                    navigate(fallbackPath, { replace: true });
                    return;
                }

                const res = await fetch(
                    `http://localhost:8080/api/invoices/getByDistributor/${distributorId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error('Gagal mengambil data invoice');

                const data = await res.json();

                // Filter hanya invoice dari pabrik ke distributor
                const filtered = Array.isArray(data)
                    ? data.filter((item) => item.agen_id === null && item.pabrik_id !== null)
                    : [];

                // Ambil berdasarkan orderId dari URL (disamakan dengan frontend routing)
                const matched = filtered.find(
                    (inv) => inv.order_id?.toString() === invoiceIdFromUrl
                );

                if (matched && matched.id) {
                    fetchDetailById(matched.id);
                } else {
                    console.error('Tidak menemukan invoice dari pabrik ke distributor dengan orderId tersebut');
                    navigate(fallbackPath, { replace: true });
                }
            } catch (err) {
                console.error('Error fetching invoice:', err);
                navigate(fallbackPath, { replace: true });
            }
        };

        const fetchDetailById = async (id) => {
            const token = localStorage.getItem('token');

            try {
                const res = await fetch(`http://localhost:8080/api/invoices/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Invoice tidak ditemukan');

                const { invoice, items, order } = await res.json();

                const status = invoice.status?.toLowerCase();
                const pembayaranStatus = ['lunas', 'paid'].includes(status)
                    ? 'Lunas'
                    : 'Belum Lunas';

                const pengirimId = invoice.pabrik_id; // dari pabrik
                let pengirim = null;

                if (pengirimId) {
                    const pengirimRes = await fetch(
                        `http://localhost:8080/api/users/${pengirimId}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (pengirimRes.ok) {
                        const pengirimJson = await pengirimRes.json();
                        pengirim = pengirimJson.data || null;
                    }
                }

                const finalData = {
                    ...invoice,
                    invoice_number: invoice.invoice_number,
                    invoice_date: invoice.invoice_date,
                    order_date: order?.order_date || null,
                    agen_name: order?.agen?.name || '-',
                    items,
                    order,
                    pengirim_bank: pengirim,
                    statusPembayaran: pembayaranStatus,
                };

                setInvoiceData(finalData);
                setStatusPembayaran(pembayaranStatus);
            } catch (err) {
                console.error('Gagal memuat detail invoice:', err);
                navigate(fallbackPath, { replace: true });
            }
        };

        if (state?.tagihan?.id) {
            fetchDetailById(state.tagihan.id);
        } else if (invoiceIdFromUrl) {
            fetchInvoice();
        }
    }, [state, invoiceIdFromUrl, fallbackPath, navigate]);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const handleKonfirmasi = () => {
        setStatusPembayaran('Lunas');
        closeModal();
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
