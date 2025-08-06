// src/Components/Table/ShippingStatusTable.jsx
import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

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

const ShippingStatusTable = ({ orders }) => {
    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, rowIndex) => rowIndex + 1,
        },
        {
            header: 'Order ID',
            key: 'orderId',
            render: (value) => value?.toUpperCase(),
        },
        { header: 'Agen', key: 'agenName', render: (val) => val || '-' },
        {
            header: 'Tanggal Order',
            key: 'order_date',
            render: (value) => value ? formatDate(value) : '-',
        },
        {
            header: 'Tanggal Pengiriman',
            key: 'delivery_date',
            render: (value) => value ? formatDate(value) : '-',
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
