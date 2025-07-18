// src/Components/Table/ValidasiOrderTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable'; // pastikan path sesuai

const ValidasiOrderTable = ({ orders }) => {
    const navigate = useNavigate();

    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1,
        },
        { header: 'Order ID', key: 'orderId' },
        {
            header: 'Agen ID',
            key: 'agentId',
            render: (val) => val || 'AG-001',
        },
        {
            header: 'Alamat',
            key: 'address',
            render: (val) => val || 'Jl. Melati no.20 Jakarta',
        },
        { header: 'Tanggal Order', key: 'orderDate' },
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
            render: (val) => (
                <span className="bg-yellow-400 text-white px-2 py-1 rounded text-sm font-bold">
                    {val}
                </span>
            ),
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
