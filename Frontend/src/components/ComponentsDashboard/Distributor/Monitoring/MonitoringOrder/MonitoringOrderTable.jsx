// src/components/ComponentsDashboard/Distributor/Monitoring/MonitoringOrderTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../Common/StatusBadge';
import ReusableTable from '../../../Common/ReusableTable';

const MonitoringOrderTable = ({ orders }) => {
    const navigate = useNavigate();

    const formatDate = (val) =>
        val
            ? new Date(val).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
            : '-';

    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1,
        },
        { header: 'Order ID', key: 'orderCode', render: (v) => (v || '').toUpperCase() },
        { header: 'Agen', key: 'agenName' },
        {
            header: 'Pabrik',
            key: 'pabrikName',
            render: (val) => val || 'Pabrik tidak diketahui',
        },
        {
            header: 'Tanggal Order',
            key: 'orderDate',
            render: (val) => formatDate(val),
        },
        {
            header: 'Estimasi Sampai',
            key: 'deliveryDate',
            render: (val) => val?.split(' ')[0] || '-',
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
                <div className="button-group flex flex-wrap gap-2 justify-center">
                    <button
                        className="px-4 py-1 bg-blue-900 text-white text-sm rounded font-semibold hover:opacity-90"
                        onClick={() =>
                            navigate(`/distributor/monitoring-order/detail/${row.orderId}`)
                        }
                    >
                        Detail
                    </button>
                    <button className="px-4 py-1 bg-blue-900 text-white text-sm rounded font-semibold hover:opacity-90">
                        Buat Invoice
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
                        className="px-4 py-3 text-sm text-right font-medium text-gray-600 border-t border-gray-300"
                    >
                        Total Order: {orders.length}
                    </td>
                </tr>
            }
        />
    );
};

export default MonitoringOrderTable;
