import React from 'react';
import ReusableTable from '../../Common/ReusableTable'; // sesuaikan path

const getStatusClass = (status) => {
    switch (status) {
        case 'Tertunda': return 'status-badge status-pending';
        case 'Disetujui': return 'status-badge status-approved';
        case 'Diproses': return 'status-badge status-processing';
        case 'Ditolak': return 'status-badge status-rejected';
        case 'Dikirim': return 'status-badge status-shipped';
        case 'Selesai': return 'status-badge button-confirm active';
        default: return 'status-badge status-default';
    }
};

const DetailOrderInfo = ({ order }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia.</p>;

    const columns = [
        { header: 'Order ID', key: 'orderId' },
        { header: 'Distributor', key: 'distributor' },
        { header: 'Alamat', key: 'address' },
        { header: 'Tanggal Order', key: 'orderDate' },
        { header: 'Estimasi Sampai', key: 'deliveryEstimate' },
        {
            header: 'Status Order',
            key: 'status',
            render: (value) => <span className={getStatusClass(value)}>{value}</span>,
        },
    ];

    const data = [
        {
            orderId: order.orderId,
            distributor: order.distributor || 'Tidak tersedia',
            address: order.address || 'Alamat tidak tersedia',
            orderDate: order.orderDate,
            deliveryEstimate: order.deliveryEstimate || '-',
            status: order.status,
        },
    ];

    return (
        <div>
            <h2 className="text-lg font-semibold mb-3">Detail Order</h2>
            <ReusableTable columns={columns} data={data} />
        </div>
    );
};

export default DetailOrderInfo;
