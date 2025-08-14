// src/Components/ComponentsDashboard/Common/ValidasiActions.jsx
import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ValidasiActions = ({ orderId, onKirim, handleTolak }) => {
    const navigate = useNavigate();

    const showConfirmation = async (title, text, onConfirm, redirectPath) => {
        const result = await Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lanjutkan',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed && typeof onConfirm === 'function') {
            await onConfirm(orderId);

            if (redirectPath) {
                navigate(redirectPath);
            }
        }
    };

    return (
        <div className="mt-6 flex gap-4">
            {/* TOMBOL KIRIM */}
            <button
                className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-1 rounded font-bold"
                onClick={() =>
                    showConfirmation(
                        'Kirim Order',
                        'Apakah Anda yakin ingin mengirim order ini ke pabrik dan menyetujui order?',
                        onKirim
                    )
                }
            >
                Setujui & Kirim
            </button>

            {/* TOMBOL TOLAK */}
            <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-1 rounded font-bold"
                onClick={() =>
                    showConfirmation(
                        'Tolak Order',
                        'Apakah Anda yakin ingin menolak order ini? Tindakan ini tidak dapat dibatalkan.',
                        handleTolak
                    )
                }
            >
                Tolak
            </button>
        </div>
    );
};

export default ValidasiActions;
