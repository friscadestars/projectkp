import React from 'react';
import StatusBadge from './StatusBadge'; // Komponen baru

const OrderInfoTable = ({ order }) => (
    <>
        <h2 className="font-semibold text-md mb-2">Detail Order</h2>
        <table className="w-full text-sm mb-6">
            <thead>
                <tr className="bg-blue-900 text-white">
                    <th className="py-2 px-4">Order ID</th>
                    <th className="py-2 px-4">Agen ID</th>
                    <th className="py-2 px-4">Alamat</th>
                    <th className="py-2 px-4">Tanggal Order</th>
                    <th className="py-2 px-4">Jumlah Produk</th>
                    <th className="py-2 px-4">Status Order</th>
                </tr>
            </thead>
            <tbody>
                <tr className="text-center border">
                    <td className="py-2 px-4">{order.orderId}</td>
                    <td className="py-2 px-4">AG-001</td>
                    <td className="py-2 px-4">Jl. Melati no.20 Jakarta</td>
                    <td className="py-2 px-4">{order.orderDate}</td>
                    <td className="py-2 px-4">{order.products.reduce((sum, p) => sum + p.quantity, 0)}</td>
                    <td className="py-2 px-4">
                        <StatusBadge status={order.status} />
                    </td>
                </tr>
            </tbody>
        </table>
    </>
);

export default OrderInfoTable;
