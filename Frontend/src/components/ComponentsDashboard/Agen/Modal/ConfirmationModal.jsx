import React from 'react';

const ConfirmationModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
        <div className="bg-white border border-gray-300 rounded-md w-full max-w-md p-6 text-center shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Konfirmasi Penerimaan Order</h2>
            <p className="text-sm text-gray-600 mb-6">Apakah Anda yakin pesanan sudah benar-benar diterima?</p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={onCancel}
                    className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-semibold"
                >
                    Batal
                </button>
                <button
                    onClick={onConfirm}
                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-semibold"
                >
                    Ya, Diterima
                </button>
            </div>
        </div>
    </div>
);


export default ConfirmationModal;
