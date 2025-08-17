import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);

    if (isNaN(d.getTime())) return '-';

    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')
        }/${d.getFullYear()}`;
};

const formatPrice = (value) => value ? `Rp ${value.toLocaleString('id-ID')}` : '-';

const OrderHistoryTable = ({ orders, onDelete, onDetail, loading }) => {
    const columns = [
        { header: 'No', key: 'no', render: (_, __, i) => i + 1 },
        {
            header: 'Order ID',
            key: 'orderCode',
            render: (value) => value?.toUpperCase(),
        },
        { header: 'Distributor', key: 'distributorName' },
        { header: 'Tanggal Order', key: 'orderDate', render: formatDate },
        {
            header: 'Tanggal Terima',
            key: 'receivedDate',
            render: (v) => v ? formatDate(v) : '-'
        },
        { header: 'No. Resi', key: 'trackingNumber', render: (v) => v || '-' },
        { header: 'Total Harga', key: 'totalPrice', render: formatPrice },
        {
            header: 'Status Order',
            key: 'status',
            render: (v) => <StatusBadge status={v} />,
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <div className="flex justify-center gap-2">
                    <button onClick={() => onDetail(row)} className="button-detail">
                        Detail
                    </button>
                    <button onClick={() => onDelete(row.orderId)} className="button-delete">
                        Hapus
                    </button>
                </div>
            ),
        },
    ];

    return (
        <ReusableTable
            columns={columns}
            data={orders}
            loading={loading}
            footer={
                <tr>
                    <td colSpan={columns.length} className="px-4 py-3 text-right font-medium text-gray-600">
                        Total Riwayat Order: {orders.length}
                    </td>
                </tr>
            }
        />
    );
};

export default OrderHistoryTable;
