import React, { useEffect, useState } from 'react';
import InvoiceTable from './InvoiceTable';

const BuatInvoiceModal = ({ order = {}, onClose }) => {
    const {
        orderCode,
        agentName,
        pabrikName,
        orderDate,
        distributor_id,
        invoiceDate,
        dueDate,
        note,
        products = [],
        bankName,
        accountName,
        accountNumber
    } = order;

    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoiceNumber = async () => {
            try {
                const token = localStorage.getItem('token');
                let url = '';

                if (order?.pabrik_id && distributor_id) {
                    url = `${BASE_URL}/invoices/generate/pabrik/${order.pabrik_id}`;
                } else if (distributor_id) {
                    url = `${import.meta.env.VITE_API_BASE_URL}/invoices/generate/distributor/${distributor_id}`;
                } else if (order?.agen_id) {
                    url = `${import.meta.env.VITE_API_BASE_URL}/invoices/generate/agen/${order.agen_id}`;
                }

                if (!url) {
                    setInvoiceNumber('INVALID_ROLE');
                    setLoading(false);
                    return;
                }

                const res = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (res.ok) {
                    setInvoiceNumber(data.invoice_number || 'TIDAK ADA');
                } else {
                    console.error('Gagal ambil nomor invoice:', data.message);
                    setInvoiceNumber('GAGAL_GENERATE');
                }
            } catch (error) {
                console.error('Error saat ambil nomor invoice:', error);
                setInvoiceNumber('ERROR');
            } finally {
                setLoading(false);
            }
        };

        if (order?.pabrik_id || distributor_id || order?.agen_id) {
            fetchInvoiceNumber();
        }
    }, [order?.id, order?.pabrik_id, distributor_id, order?.agen_id]);

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Buat Invoice</h2>
            <div className="mb-4">
                <p><strong>Order ID:</strong> {orderCode}</p>
                <p><strong>Agen:</strong> {agentName}</p>
                <p><strong>Pabrik:</strong> {pabrikName || 'Pabrik tidak diketahui'}</p>
                <p><strong>Tanggal Order:</strong> {orderDate}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Nomor Invoice</label>
                    <input
                        type="text"
                        value={loading ? 'Memuat...' : invoiceNumber}
                        disabled
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
