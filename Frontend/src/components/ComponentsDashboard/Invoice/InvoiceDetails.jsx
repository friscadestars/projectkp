import React from 'react';

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID');
};

const InvoiceDetails = ({ invoiceData, showAgen = false, showDistributor = false }) => {
    const statusRaw = invoiceData?.tagihan?.status || invoiceData?.statusPembayaran || '';
    const normalizedStatus = statusRaw.toLowerCase();

    console.log('📦 invoiceData:', invoiceData);
    return (
        <div className="text-gray-800 mb-6 space-y-2">
            <p>
                <strong>Order ID:</strong>{' '}
                {(invoiceData.orderCode ||
                    `ORD-${String(invoiceData.order_id || invoiceData.orderId).padStart(3, '0')}`).toUpperCase()}
            </p>

            {showDistributor && (
                <p><strong>Distributor:</strong> {invoiceData.distributor_id || invoiceData.distributorName || '–'}</p>
            )}

            {showAgen && (
                <p><strong>Agen:</strong> {invoiceData.agen_id || invoiceData.agenName || '–'}</p>
            )}

            <p><strong>Tanggal Order:</strong> {formatDate(invoiceData.invoice_date || invoiceData.tanggalOrder || invoiceData.orderDate)}</p>

            <p className="flex items-center gap-2">
                <strong>Status Pembayaran:</strong>
                <button
                    disabled
                    className={`px-3 py-1 rounded text-sm font-bold cursor-default ${normalizedStatus === 'belum lunas'
                        ? 'bg-red-600'
                        : normalizedStatus === 'lunas' || normalizedStatus === 'paid'
                            ? 'bg-green-600'
                            : 'bg-gray-600'
                        } text-white`}
                >
                    {normalizedStatus === 'belum lunas'
                        ? 'Belum Dibayar'
                        : normalizedStatus === 'lunas' || normalizedStatus === 'paid'
                            ? 'Lunas'
                            : 'Status Tidak Diketahui'}
                </button>
            </p>

        </div>
    );
};

export default InvoiceDetails;
