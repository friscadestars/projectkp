// src/Components/Distributor/MonitoringOrderTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusLabel from '../StatusLabel';
import ReusableTable from '../../../Common/ReusableTable'; // sesuaikan path

const MonitoringOrderTable = ({ orders }) => {
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
            key: 'agenId',
            render: (val) => val || 'AG-001',
        },
        {
            header: 'Pabrik ID',
            key: 'pabrikId',
            render: (val) => val || 'PB-001',
        },
        { header: 'Tanggal Order', key: 'orderDate' },
        {
            header: 'Estimasi Sampai',
            key: 'estimatedDate',
            render: (val) => val || '-',
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (val) => <StatusLabel status={val} />,
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <div className="button-group flex flex-wrap gap-2 justify-center">
                    <button
                        className="btn-detail px-4 py-1 bg-blue-900 text-white text-sm rounded font-semibold hover:opacity-90"
                        onClick={() =>
                            navigate(`/distributor/monitoring-order/detail/${row.orderId}`)
                        }
                    >
                        Detail
                    </button>
                    <button className="btn-invoice px-4 py-1 bg-blue-900 text-white text-sm rounded font-semibold hover:opacity-90">
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
