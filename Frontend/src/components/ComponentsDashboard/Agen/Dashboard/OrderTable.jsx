import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const OrderTable = ({ orders, detailPath = '', showAction = true }) => {
    const navigate = useNavigate();

    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1
        },
        {
            header: 'Order ID',
            key: 'orderCode',
            render: (value) => value?.toUpperCase(),
        },
        {
            header: 'Distributor',
            key: 'distributorName',
        },
        {
            header: 'Tanggal Order',
            key: 'orderDate',
            render: (value) => {
                if (!value) return '-';
                const date = new Date(value);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            },
        },
        {
            header: 'Estimasi Pengiriman',
            key: 'deliveryDate',
            render: (value) => value || '-',
        },
        {
            header: 'Jumlah Produk',
            key: 'products',
            render: (products) =>
                products?.reduce((sum, p) => sum + p.quantity, 0) || 0,
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (value) => <StatusBadge status={value} />,
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
        <div className="overflow-x-auto">
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
        </div>
    );
};

export default OrderTable;
