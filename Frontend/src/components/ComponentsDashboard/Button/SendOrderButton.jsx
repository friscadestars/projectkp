import React from 'react';
import { useNavigate } from 'react-router-dom';

const SendOrderButton = ({ orderId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        alert(`Order ${orderId} berhasil dikirim ke pabrik.`);
        navigate('/distributor/kirim-order');
    };

    return (
        <button
            onClick={handleClick}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded text-sm"
        >
            Kirim
        </button>
    );
};

export default SendOrderButton;
