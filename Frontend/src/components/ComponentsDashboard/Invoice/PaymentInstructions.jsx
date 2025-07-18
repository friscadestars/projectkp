import React from 'react';

const PaymentInstructions = ({ bankName, accountName, accountNumber }) => (
    <div className="bg-gray-50 p-4 border border-gray-200 rounded mb-4">
        <h3 className="font-semibold text-blue-900 mb-2">Instruksi Pembayaran:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
            <li><strong>Bank:</strong> {bankName}</li>
            <li><strong>Atas Nama:</strong> {accountName}</li>
            <li><strong>No. Rekening:</strong> {accountNumber}</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">* Silakan transfer sesuai nominal total dan kirim bukti transfer untuk konfirmasi.</p>
    </div>
);

export default PaymentInstructions;
