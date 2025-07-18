import React from 'react';
import ReusableTable from '../../Common/ReusableTable'; // pastikan path ini sesuai

const OrderHistoryTable = ({ orders, onDelete, onDetail }) => {
    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, rowIndex) => rowIndex + 1,
        },
        { header: 'Order ID', key: 'orderId' },
        { header: 'Distributor', key: 'distributor' },
        { header: 'Tanggal Order', key: 'orderDate' },
        {
            header: 'Tanggal Terima',
            key: 'receivedDate',
            render: (value) => value || '-',
        },
        {
            header: 'No. Resi',
            key: 'noResi',
            render: (value) => value || '-',
        },
        {
            header: 'Total Harga',
            key: 'total',
            render: (value) =>
                value ? `Rp ${value.toLocaleString('id-ID')}` : '-',
        },
        {
            header: 'Status Order',
            key: 'status',
            render: () => <span className="status-finished">Selesai</span>,
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => onDetail(row)}
                        className="button-detail"
                    >
                        Detail
                    </button>
                    <button
                        onClick={() => onDelete(row.id)}
                        className="button-delete"
                    >
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
            footer={
                <tr>
                    <td
                        colSpan={columns.length}
                        className="px-4 py-3 text-right text-gray-600 font-medium"
                    >
                        Total Riwayat Order: {orders.length}
                    </td>
                </tr>
            }
        />
    );

};

export default OrderHistoryTable;
