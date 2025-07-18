import React from 'react';
import Swal from 'sweetalert2';

const ValidasiActions = ({ handleTerima, handleTolak }) => {
    const showConfirmation = async (title, text, onConfirm) => {
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
            onConfirm();
        }
    };

    return (
        <div className="mt-6 flex gap-4">
            <button
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-1 rounded font-bold"
                onClick={() =>
                    showConfirmation(
                        'Konfirmasi Validasi',
                        'Apakah Anda yakin ingin menyetujui order ini dan mengirimkannya ke pabrik?',
                        handleTerima
                    )
                }
            >
                Terima
            </button>
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
