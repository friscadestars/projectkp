import React from "react";
import ReusableTable from "../../../Common/ReusableTable";

const OrderDetailTable = ({ order }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia.</p>;

    const columns = [
        { header: 'Order ID', key: 'orderId' },
        { header: 'Agen ID', key: 'agenId', render: () => 'AG-001' },
        { header: 'Pabrik ID', key: 'pabrikId', render: () => 'PB-001' },
        { header: 'Tanggal Order', key: 'orderDate' },
        {
            header: 'Estimasi Sampai',
            key: 'estimatedDate',
            render: (val) => val || '-',
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (val) => (
                <span className={`
                    px-3 py-1 text-sm rounded text-white font-bold
                    ${val === 'Belum Dikirim' ? 'bg-orange-400' :
                        val === 'Disetujui' ? 'bg-green-500' :
                            val === 'Diproses' ? 'bg-blue-500' :
                                val === 'Dikirim' ? 'bg-cyan-500' :
                                    val === 'Diterima' ? 'bg-emerald-500' :
                                        'bg-gray-400'
                    }
                `}>
                    {val}
                </span>
            ),
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
                            className="px-4 py-3 border-t border-gray-300 text-sm text-gray-600 text-right font-medium"
                        >
                        </td>
                    </tr>
                }
            />
        </>
    );
};

export default OrderDetailTable;
