import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useInvoiceTagihan = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [invoiceData, setInvoiceData] = useState(null);
    const [statusPembayaran, setStatusPembayaran] = useState('Belum Lunas');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false); // ✅ Tambahkan ini

    useEffect(() => {
        if (location.state && location.state.tagihan) {
            const tagihan = location.state.tagihan;
            setInvoiceData(tagihan);
            setStatusPembayaran(tagihan.statusPembayaran || 'Belum Lunas');
        } else {
            navigate('/tagihan');
        }
    }, [location.state, navigate]);

    const handleConfirmPayment = () => {
        setStatusPembayaran('Lunas');
        setShowModal(false); // ✅ Tutup modal saat pembayaran dikonfirmasi
    };

    const toggleDropdown = () => setShowDropdown(prev => !prev);

    // ✅ Handler tambahan
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return {
        invoiceData,
        statusPembayaran,
        showDropdown,
        toggleDropdown,
        handleConfirmPayment,
        showModal,
        openModal,
        closeModal
    };
};

export default useInvoiceTagihan;
