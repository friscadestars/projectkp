import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const KirimActions = ({ onKirim }) => {
    const navigate = useNavigate();
    const { orderId } = useParams();

    const handleKirim = () => {
        onKirim?.(); // jika ada prop onKirim dijalankan
        alert(`Order ${orderId} berhasil dikirim ke pabrik.`);
        navigate('/distributor/kirim-order');
    };

    return (
        <button
            onClick={handleKirim}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded text-sm font-bold"
        >
            Kirim
        </button>
    );
};

export default KirimActions;
