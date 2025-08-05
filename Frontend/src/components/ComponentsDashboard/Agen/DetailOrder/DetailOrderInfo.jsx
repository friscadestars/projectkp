import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const DetailOrderInfo = ({ order, mode = 'ringkasan' }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia.</p>;

    const isRiwayat = mode === 'riwayat';

    const formatDate = (val) => {
        if (!val) return '-';
        const date = new Date(val);
        return isNaN(date.getTime()) ? val : date.toLocaleDateString('id-ID');
    };

    const columns = [
        {
            header: 'Order ID',
            key: 'orderCode',
            render: (val) => (val || '').toUpperCase(),
        },
        { header: 'Distributor', key: 'distributor' },
        { header: 'Alamat', key: 'address' },
        {
            header: 'Tanggal Order',
            key: 'orderDate',
            render: (val) => {
                if (!val) return '-';
                const [year, month, day] = val.split('-');
                return `${day}/${month}/${year}`;
            }
        },
        isRiwayat
            ? { header: 'Tanggal Terima', key: 'receivedDate', render: formatDate }
            : {
                header: 'Tanggal Pengiriman',
                key: 'deliveryDate',
                render: (val) => {
                    if (!val) return '-';
                    const date = new Date(val);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                }
            },
        {
            header: 'Status Order',
            key: 'status',
            render: (value) => <StatusBadge status={value} />,
        },
    ];

    const data = [
        {
            orderCode: order.orderCode || '-',
            distributor: order.distributor || order.distributorName || 'Tidak tersedia',
            address: order.alamat || 'Alamat tidak tersedia',
            orderDate: order.orderDate || '-',
            deliveryDate: order.deliveryDate || '-',
            receivedDate: order.receivedDate || '-',
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
