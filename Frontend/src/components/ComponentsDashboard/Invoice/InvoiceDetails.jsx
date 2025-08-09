import React from 'react';

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const safeDateStr = dateStr.replace(' ', 'T');
    const date = new Date(safeDateStr);

    if (isNaN(date)) return '-';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const InvoiceDetails = ({ invoiceData, showAgen = false, showDistributor = false }) => {
    const statusRaw = invoiceData?.tagihan?.status || invoiceData?.statusPembayaran || '';
    const normalizedStatus = statusRaw.toLowerCase();

    // Data order yang mungkin tersedia
    const order = invoiceData?.order || {};

    // Agen / Distributor name fallback
    const agenName =
        invoiceData.agen_name ||
        invoiceData.agenName ||
        order.agen_name ||
        order.agenName ||
        '-';

    const distributorName =
        invoiceData.distributor_name ||
        invoiceData.distributorName ||
        order.distributor_name ||
        order.distributorName ||
        '-';

    const tanggalOrder =
        invoiceData.orderDate ||  // ambil langsung dari hook
        invoiceData.order_date ||
        order.order_date ||
        invoiceData.invoice_date || // fallback terakhir
        null;


    return (
        <div className="text-gray-800 mb-6 space-y-2">
            <p>
                <strong>Order ID:</strong>{' '}
                {(invoiceData.orderCode ||
                    `ORD-${String(invoiceData.order_id || invoiceData.orderId || order.id).padStart(3, '0')}`).toUpperCase()}
            </p>

            {showAgen && (
                <p><strong>Agen:</strong> {agenName}</p>
            )}

            {showDistributor && (
                <p><strong>Distributor:</strong> {distributorName}</p>
            )}

            <p><strong>Tanggal Order:</strong> {tanggalOrder ? formatDate(tanggalOrder) : '-'}</p>

            <p className="flex items-center gap-2">
                <strong>Status Pembayaran:</strong>
                <button
                    disabled
                    className={`px-3 py-1 rounded text-sm font-bold cursor-default ${['unpaid', 'belum lunas'].includes(normalizedStatus)
                        ? 'bg-red-600'
                        : ['paid', 'lunas', 'dibayar'].includes(normalizedStatus)
                            ? 'bg-green-600'
                            : 'bg-gray-600'
                        } text-white`}
                >
                    {['unpaid', 'belum lunas'].includes(normalizedStatus)
                        ? 'Belum Dibayar'
                        : ['paid', 'lunas', 'dibayar'].includes(normalizedStatus)
                            ? 'Lunas'
                            : 'Status Tidak Diketahui'}
                </button>
            </p>
        </div>
    );
};

export default InvoiceDetails;
