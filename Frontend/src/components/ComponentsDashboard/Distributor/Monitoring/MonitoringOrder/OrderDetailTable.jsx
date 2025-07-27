import React from "react";
import ReusableTable from "../../../Common/ReusableTable";
import StatusBadge from '../../../Common/StatusBadge';

const OrderDetailTable = ({ order }) => {
    if (!order) return <p>Data tidak ditemukan.</p>;

    const columns = [
        {
            header: 'Order ID', key: 'order_code',
            render: (val) => (val || '').toUpperCase(),
        },
        {
            header: 'Agen', key: 'agen',
            render: (val) => val || 'Nama tidak ditemukan',
        },
        {
            header: 'Pabrik ID', key: 'pabrik_id',
            render: (val) => val || '-',
        },
        {
            header: 'Tanggal Order', key: 'order_date',
            render: (val) => val?.split(' ')[0] || '-',
        },
        {
            header: 'Estimasi Sampai', key: 'delivery_date',
            render: (val) => val?.split(' ')[0] || '-',
        },
        {
            header: 'Status Order',
            key: 'status',
            render: status => <StatusBadge status={status} />,
        },
    ];

    return (
        <>
            <h2 className="font-semibold text-md mb-2">Detail Order</h2>
            <ReusableTable
                columns={columns}
                data={[order]}
                footer={<tr><td colSpan={columns.length}></td></tr>}
            />
        </>
    );
};

export default OrderDetailTable;
