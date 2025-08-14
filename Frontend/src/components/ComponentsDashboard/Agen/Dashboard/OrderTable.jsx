import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const parseDate = (dateString) => {
    if (!dateString) return '-';
    const [d, m, y] = dateString.split('/').map(Number);
    const date = new Date(y, m - 1, d);
    return isNaN(date) ? '-' : `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
};

const OrderTable = ({ orders, detailPath = '', showAction = true }) => {
    const navigate = useNavigate();

    const columns = [
        { header: 'No', key: 'no', render: (_, __, index) => index + 1 },
        { header: 'Order ID', key: 'orderId', render: (value) => value?.toUpperCase() },
        { header: 'Distributor', key: 'distributor' },
        { header: 'Tanggal Order', key: 'orderDate', render: parseDate },
        { header: 'Tanggal Pengiriman', key: 'deliveryEstimate', render: (value) => value || '-' },
        {
            header: 'Jumlah Produk',
            key: 'products',
            render: (products) => products?.reduce((sum, p) => sum + (+p.quantity || 0), 0) || 0
        },
        { header: 'Status Order', key: 'status', render: (value) => <StatusBadge status={value} /> },
        ...(showAction
            ? [{
                header: 'Aksi',
                key: 'aksi',
                render: (_, row) => (
                    <button
                        onClick={() => navigate(`${detailPath}/${row.orderId}`)}
                        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs"
                    >
                        Detail
                    </button>
                ),
            }]
            : []),
    ];

    return (
        <div className="flex flex-col lg:flex-row">
            <ReusableTable
                columns={columns}
                data={orders}
                footer={
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="px-4 py-3 text-right font-medium text-gray-600"
                        >
                            Total Pesanan Terbaru: {orders.length}
                        </td>
                    </tr>
                }
            />
        </div>
    );
};

export default OrderTable;
