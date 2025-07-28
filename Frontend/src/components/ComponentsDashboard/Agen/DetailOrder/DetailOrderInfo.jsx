import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const DetailOrderInfo = ({ order }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia.</p>;

    const columns = [
        {
            header: 'Order ID',
            key: 'orderCode',
            render: (val) => (val || '').toUpperCase(),
        },
        { header: 'Distributor', key: 'distributor' },
        { header: 'Alamat', key: 'address' },
        { header: 'Tanggal Order', key: 'orderDate' },
        { header: 'Estimasi Sampai', key: 'deliveryDate' },
        {
            header: 'Status Order',
            key: 'status',
            render: (value) => <StatusBadge status={value} />,
        },
    ];

    const data = [
        {
            orderCode: order.orderCode || '-',
            distributor: order.distributorName || 'Tidak tersedia',
            address: order.alamat || 'Alamat tidak tersedia',
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate || '-',
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
