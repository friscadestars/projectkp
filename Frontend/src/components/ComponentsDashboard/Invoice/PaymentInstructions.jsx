import React from 'react';

const PaymentInstructions = ({ bankName, accountName, accountNumber }) => (
    <div className="bg-gray-200 p-4 border border-gray-200 border-l-4 border-l-blue-900 rounded mb-4">
        <h3 className="font-semibold text-blue-900 mb-2">Cara Pembayaran:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
            <li><strong>Bank:</strong> {bankName}</li>
            <li><strong>Nama Rekening:</strong> {accountName}</li>
            <li><strong>No. Rekening:</strong> {accountNumber}</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">* Silakan transfer sesuai nominal total dan kirim bukti transfer untuk konfirmasi.</p>
    </div>
);

export default PaymentInstructions;
