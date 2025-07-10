// src/Components/Table/OrderTableRingkasan.jsx
import React from 'react';

const OrderTableRingkasan = ({ orders, onDetail, onConfirm, getEstimatedDate, getStatusClasses }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-base text-sm text-center">
            <thead>
                <tr className="bg-blue-900 text-white">
                    <th className="px-4 py-2 rounded-tl-md">No</th>
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Distributor</th>
                    <th className="px-4 py-2">Tanggal Order</th>
                    <th className="px-4 py-2">Estimasi Sampai</th>
                    <th className="px-4 py-2">No. Resi</th>
                    <th className="px-4 py-2">Status Order</th>
                    <th className="px-4 py-2 rounded-tr-md">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{order.orderId}</td>
                            <td className="px-4 py-2">{order.distributor}</td>
                            <td className="px-4 py-2">{order.orderDate}</td>
                            <td className="px-4 py-2">{getEstimatedDate(order)}</td>
                            <td className="px-4 py-2">{order.noResi || '-'}</td>
                            <td className="px-4 py-2">
                                <span className={`px-3 py-1 rounded text-sm ${getStatusClasses(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-4 py-2 flex flex-wrap justify-center gap-2">
                                <button onClick={() => onDetail(order)} className="bg-blue-900 text-white px-3 py-1 rounded text-sm hover:bg-blue-800 font-bold">Detail</button>
                                <button
                                    onClick={() => onConfirm(order.id)}
                                    disabled={order.status !== 'Dikirim'}
                                    className={`px-3 py-1 rounded text-sm font-bold ${order.status === 'Dikirim' ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                                    Diterima
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="py-4 text-gray-500 italic">Tidak ada order ditemukan.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default OrderTableRingkasan;
