import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';
import { useOrder } from '../../../../Context/OrderContext';

const normalizeStatus = (status) => {
    const map = {
        pending: 'pending',
        approved: 'approved',
        shipped: 'shipped',
        processed: 'processed',
        cancelled: 'cancelled',
        received: 'received',
    };

    return map[status?.toLowerCase()] || status?.toLowerCase();
};

const DistributorKirimOrderTable = () => {
    const navigate = useNavigate();
    const { orders } = useOrder(); // Ambil semua order dari context
    console.log('Orders di context:', orders);
    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1,
        },
        {
            header: 'Order ID',
            key: 'orderCode',
            render: (_, row) =>
                (row.orderCode || row.order_code || row.orderId || '').toUpperCase(),
        },
        {
            header: 'Agen',
            key: 'agen',
            render: (_, row) =>
                row.agen || row.agenName || row.agentName || row.agen_id || '-',
        },
        {
            header: 'Alamat',
            key: 'alamat',
            render: (_, row) =>
                row.alamat || row.note || row.address || '-',
        },
        {
            header: 'Tanggal Order',
            key: 'orderDate',
            render: (val, row) => row.orderDate || row.order_date?.split(' ')[0] || '-',
        },
        {
            header: 'Jumlah Produk',
            key: 'products',
            render: (_, row) => {
                const items = row.products || row.items || [];
                return Array.isArray(items)
                    ? items.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0)
                    : 0;
            },
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
                    onClick={() => navigate(`/distributor/detail-kirim/${row.id || row.orderId}`)}
                    className="bg-blue-900 text-white px-3 py-1 rounded text-sm hover:opacity-90 font-bold"
                    style={{ position: 'relative', zIndex: 10 }}
                >
                    Detail
                </button>
            ),
        },
    ];

    // Filter hanya yang status-nya 'approved' setelah normalisasi
    const approvedOrders = orders.filter(
        (order) => normalizeStatus(order.status) === 'approved'
    );

    return (
        <ReusableTable
            columns={columns}
            data={approvedOrders}
            footer={
                <tr>
                    <td
                        colSpan={columns.length}
                        className="px-4 py-3 text-right text-gray-600 font-medium"
                    >
                        Total Order: {approvedOrders.length}
                    </td>
                </tr>
            }
        />
    );
};

export default DistributorKirimOrderTable;
