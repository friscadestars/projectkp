import React from 'react';
import StatusBadge from '../../Common/StatusBadge';
import ReusableTable from '../../Common/ReusableTable'; // Pastikan path ini sesuai

const OrderDetailTable = ({ order }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia.</p>;

    const columns = [
        { header: 'Order ID', key: 'orderId' },
        {
            header: 'Agen ID',
            key: 'agenId',
            render: (val) => val || 'AG-001',
        },
        {
            header: 'Alamat',
            key: 'alamat',
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
            render: (status) => <StatusBadge status={status} />,
        },
    ];

    const data = [order];

    return (
        <>
            <h2 className="font-semibold text-md mb-2">Detail Order</h2>
            <ReusableTable
                columns={columns}
                data={data}
                footer={
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="border-t border-gray-300 px-4 py-3 text-right text-sm text-gray-600"
                        >
                        </td>
                    </tr>
                }
            />
        </>
    );
};

export default OrderDetailTable;
