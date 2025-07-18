// src/Components/Table/OrderTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable';

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Tertunda': return 'status-badge status-pending';
        default: return 'status-badge status-default';
    }
};

const OrderTable = ({ orders, detailPath = '', showAction = true }) => {
    const navigate = useNavigate();

    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1
        },
        { header: 'Order ID', key: 'orderId' },
        { header: 'Distributor', key: 'distributor' },
        { header: 'Tanggal Order', key: 'orderDate' },
        {
            header: 'Estimasi Pengiriman',
            key: 'deliveryEstimate',
            render: (value) => value || '-',
        },
        {
            header: 'Jumlah Produk',
            key: 'products',
            render: (products) =>
                products?.reduce((sum, p) => sum + p.quantity, 0) || 0,
        },
        {
            header: 'No. Resi',
            key: 'noResi',
            render: (value) => value || '-',
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (value) => (
                <span className={getStatusBadgeClass(value)}>{value}</span>
            ),
        },
        ...(showAction
            ? [{
                header: 'Aksi',
                key: 'aksi',
                render: (_, row) => (
                    <button
                        onClick={() => navigate(`${detailPath}/${row.orderId}`)}
                        className="button-detail"
                    >
                        Detail
                    </button>
                ),
            }]
            : []),
    ];

    return (
        <ReusableTable
            columns={columns}
            data={orders}
            footer={
                <tr>
                    <td colSpan={columns.length} className="px-4 py-3 text-right font-medium text-gray-600">
                        Total Pesanan Terbaru: {orders.length}
                    </td>
                </tr>
            }
        />
    );

};

export default OrderTable;
