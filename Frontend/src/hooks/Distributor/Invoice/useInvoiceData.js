import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useInvoiceData = (fallbackPath = '/') => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [invoiceData, setInvoiceData] = useState(null);
    const [statusPembayaran, setStatusPembayaran] = useState('Belum Lunas');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (state?.tagihan) {
            const tagihan = state.tagihan;
            setInvoiceData(tagihan);
            setStatusPembayaran(tagihan.statusPembayaran || 'Belum Lunas');
        } else {
            navigate(fallbackPath, { replace: true }); // opsional: replace history
        }
    }, [state, navigate, fallbackPath]);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleKonfirmasi = () => {
        setStatusPembayaran('Lunas');
        closeModal(); // lebih readable
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
