import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useInvoiceTagihan = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [invoiceData, setInvoiceData] = useState(null);
    const [statusPembayaran, setStatusPembayaran] = useState('Belum Lunas');
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

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
        setShowModal(false);
    };

    const toggleDropdown = () => setShowDropdown(prev => !prev);

    return {
        invoiceData,
        statusPembayaran,
        showModal,
        showDropdown,
        toggleDropdown,
        setShowModal,
        handleConfirmPayment,
    };
};

export default useInvoiceTagihan;
