// src/Components/Table/ShippingStatusTable.jsx
import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const ShippingStatusTable = ({ orders }) => {
    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, rowIndex) => rowIndex + 1,
        },
        { header: 'Order ID', key: 'orderId' },
        { header: 'Agen', key: 'agenName', render: (val) => val || '-' },
        { header: 'Tanggal Kirim', key: 'orderDate' },
        {
            header: 'Tanggal Pengiriman',
            key: 'deliveryEstimate',
            render: (value) => value || '-',
        },
        {
            header: 'Jumlah Produk',
            key: 'products',
            render: (products) => products?.length || 0,
        },
        {
            header: 'No. Resi',
            key: 'noResi',
            render: (value) => value || '-',
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (value) => <StatusBadge status={value} />,
        },
    ];

    return (
        <ReusableTable
            columns={columns}
            data={orders}
            footer={
                <tr>
                    <td
                        colSpan={columns.length}
                        className="px-4 py-3 text-right text-gray-600 font-medium"
                    >
                        Total Pengiriman: {orders.length}
                    </td>
                </tr>
            }
        />
    );
};

export default ShippingStatusTable;
