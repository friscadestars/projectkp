import React from 'react';
import StatusBadge from './StatusBadge'; // Komponen baru

const OrderInfoTable = ({ order }) => (
    <>
        <h2 className="font-semibold text-md mb-2">Detail Order</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-sm mb-6 border-collapse">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="py-2 px-4 border-b border-gray-300">Order ID</th>
                        <th className="py-2 px-4 border-b border-gray-300">Agen ID</th>
                        <th className="py-2 px-4 border-b border-gray-300">Alamat</th>
                        <th className="py-2 px-4 border-b border-gray-300">Tanggal Order</th>
                        <th className="py-2 px-4 border-b border-gray-300">Jumlah Produk</th>
                        <th className="py-2 px-4 border-b border-gray-300">Status Order</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="text-center border-b border-gray-300">
                        <td className="py-2 px-4">{order.orderId}</td>
                        <td className="py-2 px-4">AG-001</td>
                        <td className="py-2 px-4">Jl. Melati no.20 Jakarta</td>
                        <td className="py-2 px-4">{order.orderDate}</td>
                        <td className="py-2 px-4">
                            {order.products.reduce((sum, p) => sum + p.quantity, 0)}
                        </td>
                        <td className="py-2 px-4">
                            <StatusBadge status={order.status} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
);

export default OrderInfoTable;
