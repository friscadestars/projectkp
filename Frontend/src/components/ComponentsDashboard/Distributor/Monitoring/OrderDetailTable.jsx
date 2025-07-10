import React from "react";

const OrderDetailTable = ({ order }) => {
    return (
        <>
            <h2 className="font-semibold text-md mb-2">Detail Order</h2>
            <table className="w-full text-sm mb-6">
                <thead>
                    <tr className="bg-blue-900 text-white text-center">
                        <th className="py-2 px-4">Order ID</th>
                        <th className="py-2 px-4">Agen ID</th>
                        <th className="py-2 px-4">Pabrik ID</th>
                        <th className="py-2 px-4">Tanggal Order</th>
                        <th className="py-2 px-4">Estimasi Sampai</th>
                        <th className="py-2 px-4">Status Order</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="text-center border">
                        <td className="py-2 px-4">{order.orderId}</td>
                        <td className="py-2 px-4">AG-001</td>
                        <td className="py-2 px-4">PB-001</td>
                        <td className="py-2 px-4">{order.orderDate}</td>
                        <td className="py-2 px-4">{order.estimatedDate || '-'}</td>
                        <td className="py-2 px-4">
                            <span className={`
                                px-3 py-1 text-sm rounded text-white font-bold
                                ${order.status === 'Belum Dikirim' ? 'bg-orange-400' :
                                    order.status === 'Disetujui' ? 'bg-green-500' :
                                        order.status === 'Diproses' ? 'bg-blue-500' :
                                            order.status === 'Dikirim' ? 'bg-cyan-500' :
                                                order.status === 'Diterima' ? 'bg-emerald-500' : 'bg-gray-400'}
                            `}>
                                {order.status}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default OrderDetailTable;
