// src/Components/Distributor/Riwayat/OrderInfoTable.jsx
import React from 'react';

const OrderInfoTable = ({ order }) => (
    <>
        <h2 className="font-semibold text-md mb-3">Detail Order</h2>
        <table className="min-w-full border-collapse text-sm text-left mb-6">
            <thead>
                <tr className="bg-blue-900 text-white">
                    <th className="px-4 py-2 border-b">Order ID</th>
                    <th className="px-4 py-2 border-b">Agen ID</th>
                    <th className="px-4 py-2 border-b">Tanggal Order</th>
                    <th className="px-4 py-2 border-b">Tanggal Pengiriman</th>
                    <th className="px-4 py-2 border-b">Status Pembayaran</th>
                    <th className="px-4 py-2 border-b">Status Order</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.agenId}</td>
                    <td className="px-4 py-2">{order.tanggalOrder}</td>
                    <td className="px-4 py-2">{order.tanggalPengiriman}</td>
                    <td className="px-4 py-2">
                        <span className={`text-white text-sm px-3 py-1 rounded ${order.statusPembayaran === 'Lunas' ? 'bg-green-600' : 'bg-red-600 font-bold'}`}>
                            {order.statusPembayaran}
                        </span>
                    </td>
                    <td className="px-4 py-2">
                        <span className="text-white text-sm px-3 py-1 rounded bg-blue-600 font-bold">
                            {order.statusOrder}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </>
);

export default OrderInfoTable;
