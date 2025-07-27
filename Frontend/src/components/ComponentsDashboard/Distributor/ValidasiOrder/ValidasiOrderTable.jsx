// src/Components/Table/ValidasiOrderTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const ValidasiOrderTable = ({ orders }) => {
    const navigate = useNavigate();

    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1,
        },
        {
            header: 'Order ID', key: 'orderCode',
            render: (val) => (val || '').toUpperCase()
        },
        {
            header: 'Agen',
            key: 'agenName',
            render: (val) => val || 'Nama tidak ditemukan',
        },
        {
            header: 'Alamat',
            key: 'alamat',
            render: (_, row) => row.address || row.alamat || 'Alamat tidak tersedia',
        },
        {
            header: 'Tanggal Order',
            key: 'orderDate',
            render: (val) => new Date(val).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        },
        {
            header: 'Jumlah Produk',
            key: 'products',
            render: (products) =>
                Array.isArray(products)
                    ? products.reduce((sum, p) => sum + p.quantity, 0)
                    : 0,
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (val) => <StatusBadge status={val} />,
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <button
                    onClick={() => navigate(`/distributor/detail-validasi/${row.orderId}`)}
                    className="bg-blue-900 text-white px-3 py-1 rounded text-sm hover:opacity-90 font-bold"
                >
                    Detail
                </button>
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
                        Total Order Tertunda: {orders.length}
                    </td>
                </tr>
            }
        />
    );
};

export default ValidasiOrderTable;
