import React from 'react';

const InvoiceDetails = ({ invoiceData, statusPembayaran, showAgen = false, showDistributor = false }) => (
    <div className="text-gray-800 mb-6 space-y-2">
        <p><strong>Order ID:</strong> {invoiceData.orderId}</p>

        {showDistributor && (
            <p><strong>Distributor:</strong> {invoiceData.namaDistributor || invoiceData.distributor}</p>
        )}

        {showAgen && (
            <p><strong>Agen ID:</strong> {invoiceData.agenId}</p>
        )}

        <p><strong>Tanggal Order:</strong> {invoiceData.tanggalOrder || invoiceData.orderDate}</p>

        <p className="flex items-center gap-2">
            <strong>Status Pembayaran:</strong>
            <span className={`px-3 py-1 rounded text-sm font-bold ${statusPembayaran === 'Belum Lunas' ? 'bg-red-600' : 'bg-green-600'} text-white`}>
                {statusPembayaran === 'Belum Lunas' ? 'Belum Dibayar' : 'Lunas'}
            </span>
        </p>
    </div>
);

export default InvoiceDetails;
