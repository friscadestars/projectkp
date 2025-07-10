// src/Components/Agen/Table/OrderHistoryTable.jsx

import React from 'react';

const OrderHistoryTable = ({ orders, onDelete, onDetail }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center border border-gray-200 rounded-lg shadow-sm">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="px-4 py-2 rounded-tl-md">No</th>
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Distributor</th>
                        <th className="px-4 py-2">Tanggal Order</th>
                        <th className="px-4 py-2">Tanggal Terima</th>
                        <th className="px-4 py-2">No. Resi</th>
                        <th className="px-4 py-2">Total Harga</th>
                        <th className="px-4 py-2">Status Order</th>
                        <th className="px-4 py-2 rounded-tr-md">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="py-4 text-gray-500">
                                Tidak ada riwayat order yang selesai.
                            </td>
                        </tr>
                    ) : (
                        orders.map((order, idx) => (
                            <tr key={order.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className="px-4 py-2">{order.orderId}</td>
                                <td className="px-4 py-2">{order.distributor}</td>
                                <td className="px-4 py-2">{order.orderDate}</td>
                                <td className="px-4 py-2">{order.receivedDate || '-'}</td>
                                <td className="px-4 py-2">{order.noResi || '-'}</td>
                                <td className="px-4 py-2">
                                    {order.total
                                        ? `Rp ${order.total.toLocaleString('id-ID')}`
                                        : '-'}
                                </td>
                                <td className="px-4 py-2">
                                    <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold">
                                        Selesai
                                    </span>
                                </td>
                                <td className="px-4 py-2 flex justify-center gap-2">
                                    <button
                                        onClick={() => onDetail(order)}
                                        className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm font-bold"
                                    >
                                        Detail
                                    </button>
                                    <button
                                        onClick={() => onDelete(order.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistoryTable;
