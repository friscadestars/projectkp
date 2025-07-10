// src/Components/Modal/ConfirmationModal.jsx
import React from 'react';

const ConfirmationModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Konfirmasi Penerimaan Order</h2>
            <p className="mb-6 text-gray-700">Apakah Anda yakin pesanan sudah benar-benar diterima?</p>
            <div className="flex justify-center space-x-4">
                <button onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-bold">Batal</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold">Ya, Diterima</button>
            </div>
        </div>
    </div>
);

export default ConfirmationModal;
