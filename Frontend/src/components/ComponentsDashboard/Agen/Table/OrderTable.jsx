import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderTable = ({ orders, detailPath = '', showAction = true }) => {
    const navigate = useNavigate();

    return (
        <table className="min-w-full text-base text-sm text-center">
            <thead>
                <tr className="bg-blue-900 text-white">
                    <th className="px-4 py-2 rounded-tl-md">No</th>
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Distributor</th>
                    <th className="px-4 py-2">Tanggal Order</th>
                    <th className="px-4 py-2">Estimasi Pengiriman</th>
                    <th className="px-4 py-2">Jumlah Produk</th>
                    <th className="px-4 py-2">No. Resi</th>
                    <th className="px-4 py-2">Status Order</th>
                    {showAction && <th className="px-4 py-2 rounded-tr-md">Aksi</th>}
                </tr>
            </thead>
            <tbody>
                {orders.length === 0 ? (
                    <tr>
                        <td colSpan={showAction ? "9" : "8"} className="py-4 text-gray-500 italic">
                            Tidak ada pesanan tertunda.
                        </td>
                    </tr>
                ) : (
                    orders.map((order, index) => {
                        const totalQty = order.products?.reduce((sum, p) => sum + p.quantity, 0) || 0;

                        return (
                            <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{order.orderId}</td>
                                <td className="px-4 py-2">{order.distributor}</td>
                                <td className="px-4 py-2">{order.orderDate}</td>
                                <td className="px-4 py-2">{order.deliveryEstimate || '-'}</td>
                                <td className="px-4 py-2">{totalQty}</td>
                                <td className="px-4 py-2">{order.noResi || '-'}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-3 py-1 rounded text-sm font-bold
                                            ${order.status === 'Tertunda' ? 'bg-yellow-400 text-white' : ''}
                                            ${order.status === 'Disetujui' ? 'bg-green-500 text-white' : ''}
                                            ${order.status === 'Dikirim' ? 'bg-cyan-500 text-white' : ''}
                                            ${order.status === 'Diproses' ? 'bg-blue-500 text-white' : ''}
                                            ${order.status === 'Ditolak' ? 'bg-red-500 text-white' : ''}
                                        `}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                {showAction && (
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => navigate(`${detailPath}/${order.orderId}`)}
                                            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded text-sm font-bold"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
};

export default OrderTable;
