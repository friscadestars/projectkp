import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchOrderById } from '/src/services/ordersApi';

const useInvoiceTagihan = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams(); // ambil :id dari URL

    const [invoiceData, setInvoiceData] = useState(null);
    const [statusPembayaran, setStatusPembayaran] = useState('Belum Lunas');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (location.state?.tagihan) {
                const tagihan = location.state.tagihan;
                setInvoiceData(tagihan);
                setStatusPembayaran(tagihan.statusPembayaran || 'Belum Lunas');
            } else if (id) {
                // Fetch invoice by ID dari /api/invoices/:id
                try {
                    const res = await fetch(`/api/invoices/${id}`);
                    if (!res.ok) throw new Error('Invoice tidak ditemukan');
                    const invoice = await res.json();

                    const order = await fetchOrderById(invoice.order_id);

                    setInvoiceData({
                        ...order,
                        tagihan: invoice,
                        statusPembayaran: invoice.status || 'Belum Lunas'
                    });
                    setStatusPembayaran(invoice.status || 'Belum Lunas');
                } catch (err) {
                    console.error('Gagal ambil invoice:', err);
                    navigate('/agen/tagihan');
                }
            } else {
                navigate('/agen/tagihan');
            }
        };

        loadData();
    }, [location.state, navigate, id]);

    const handleConfirmPayment = async () => {
        try {
            if (!invoiceData?.tagihan?.id) return;

            const response = await fetch(`/api/invoices/${invoiceData.tagihan.id}/confirm-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Gagal konfirmasi');

            setStatusPembayaran('Lunas');
            setShowModal(false);
        } catch (error) {
            console.error('Gagal konfirmasi pembayaran:', error);
            alert('Gagal konfirmasi pembayaran');
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
