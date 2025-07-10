import React from 'react';

const ConfirmPaymentModal = ({
    title = 'Konfirmasi Pembayaran',
    message = 'Apakah Anda yakin ingin mengonfirmasi pembayaran?',
    onCancel,
    onConfirm,
}) => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end gap-4">
                <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={onCancel}
                >
                    Batal
                </button>
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={onConfirm}
                >
                    Konfirmasi
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmPaymentModal;
