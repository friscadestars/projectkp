import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useInvoiceData = (fallbackPath = '/') => {
    const location = useLocation();
    const navigate = useNavigate();
    const [invoiceData, setInvoiceData] = useState(null);
    const [statusPembayaran, setStatusPembayaran] = useState('Belum Lunas');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (location.state?.tagihan) {
            const tagihan = location.state.tagihan;
            setInvoiceData(tagihan);
            setStatusPembayaran(tagihan.statusPembayaran || 'Belum Lunas');
        } else {
            navigate(fallbackPath);
        }
    }, [location.state, navigate, fallbackPath]);

    const handleKonfirmasi = () => {
        setStatusPembayaran('Lunas');
        setShowModal(false);
    };

    return {
        invoiceData,
        statusPembayaran,
        showModal,
        openModal: () => setShowModal(true),
        closeModal: () => setShowModal(false),
        handleKonfirmasi,
    };
};

export default useInvoiceData;
