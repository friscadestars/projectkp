import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';
import { useOrder } from '../../../../Context/OrderContext'; // Pastikan pathnya sesuai

const DistributorKirimOrderTable = () => {
    const navigate = useNavigate();
    const { orders } = useOrder(); // Ambil orders dari context

    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1,
        },
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
        {
            header: 'Tanggal Order',
            key: 'orderDate',
            render: (val) => val || '-',
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
            render: (status) => <StatusBadge status={status} />,
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <button
                    onClick={() => navigate(`/distributor/detail-kirim/${row.orderId}`)}
                    className="bg-blue-900 text-white px-4 py-1 rounded text-base font-semibold hover:opacity-90"
                    style={{ position: 'relative', zIndex: 10 }}
                >
                    Detail
                </button>
            ),
        },
    ];

return (
    <ReusableTable
        columns={columns}
        data={orders.filter(order => order.status === 'Disetujui')} // hanya tampilkan yang Disetujui
        footer={
            <tr>
                <td
                    colSpan={columns.length}
                    className="px-4 py-3 text-right text-gray-600 font-medium"
                >
                    Total Order: {
                        orders.filter(order => order.status === 'Disetujui').length
                    }
                </td>
            </tr>
        }
    />
);
};

export default DistributorKirimOrderTable;
