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
    // Ambil status dari berbagai kemungkinan field
    const statusRaw =
        invoiceData?.tagihan?.status ||
        invoiceData?.statusPembayaran ||
        invoiceData?.status ||
        invoiceData?.payment_status ||
        '';

    const normalizedStatus = statusRaw.toString().toLowerCase();

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

    // Tentukan class & label status
    let statusClass = 'bg-gray-600';
    let statusLabel = 'Status Tidak Diketahui';

    if (['unpaid', 'belum lunas'].includes(normalizedStatus)) {
        statusClass = 'bg-red-600';
        statusLabel = 'Belum Dibayar';
    } else if (['paid', 'lunas', 'dibayar'].includes(normalizedStatus)) {
        statusClass = 'bg-green-600';
        statusLabel = 'Lunas';
    } else if (['waiting_confirmation', 'menunggu validasi'].includes(normalizedStatus)) {
        statusClass = 'bg-yellow-500';
        statusLabel = 'Menunggu Validasi';
    }

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
                    className={`px-3 py-1 rounded text-sm font-bold cursor-default ${statusClass} text-white`}
                >
                    {statusLabel}
                </button>
            </p>
        </div>
    );
};

export default InvoiceDetails;
