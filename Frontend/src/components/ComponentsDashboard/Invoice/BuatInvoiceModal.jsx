import React from 'react';
import InvoiceTable from './InvoiceTable';

const BuatInvoiceModal = ({ order = {}, onClose }) => {
    const {
        orderCode,
        agentName,
        factoryName,
        orderDate,
        invoiceNumber,
        invoiceDate,
        dueDate,
        note,
        products = [],
        bankName,
        accountName,
        accountNumber
    } = order;

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Buat Invoice</h2>
            <div className="mb-4">
                <p><strong>Order ID:</strong> {orderCode}</p>
                <p><strong>Agen:</strong> {agentName}</p>
                <p><strong>Pabrik:</strong> {factoryName}</p>
                <p><strong>Tanggal Order:</strong> {orderDate}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Nomor Invoice</label>
                    <input
                        type="text"
                        value={invoiceNumber}
                        readOnly
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Tanggal Invoice</label>
                    <input
                        type="text"
                        value={invoiceDate}
                        readOnly
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Jatuh Tempo</label>
                    <input
                        type="text"
                        value={dueDate}
                        readOnly
                        className="border p-2 w-full"
                    />
                </div>
            </div>

            {note && (
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Catatan</label>
                    <textarea
                        value={note}
                        readOnly
                        className="border p-2 w-full"
                    />
                </div>
            )}

            <InvoiceTable products={products} />

            <div className="mt-6 bg-gray-100 p-4 rounded">
                <h3 className="font-semibold mb-2">Instruksi Pembayaran</h3>
                <p><strong>Bank:</strong> {bankName || '-'}</p>
                <p><strong>Nama Rekening:</strong> {accountName || '-'}</p>
                <p><strong>Nomor Rekening:</strong> {accountNumber || '-'}</p>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default BuatInvoiceModal;
