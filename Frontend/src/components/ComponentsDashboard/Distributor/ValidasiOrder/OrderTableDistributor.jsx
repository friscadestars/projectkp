import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderTableDistributor = ({
    orders,
    statusColor = 'gray',
    detailPath = '/detail',
    emptyMessage = 'Tidak ada data.',
}) => {
    const navigate = useNavigate();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-center">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="px-4 py-2 border-b">No</th>
                        <th className="px-4 py-2 border-b">Order ID</th>
                        <th className="px-4 py-2 border-b">Agen ID</th>
                        <th className="px-4 py-2 border-b">Alamat</th>
                        <th className="px-4 py-2 border-b">Tanggal Order</th>
                        <th className="px-4 py-2 border-b">Jumlah Produk</th>
                        <th className="px-4 py-2 border-b">Status Order</th>
                        <th className="px-4 py-2 border-b">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <tr key={order.orderId} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{order.orderId}</td>
                                <td className="px-4 py-2">AG-001</td>
                                <td className="px-4 py-2">Jl. Melati no.20 Jakarta</td>
                                <td className="px-4 py-2">{order.orderDate}</td>
                                <td className="px-4 py-2">
                                    {order.products.reduce((sum, p) => sum + p.quantity, 0)}
                                </td>
                                <td className="px-4 py-2">
                                    <span className={`bg-${statusColor}-500 text-white px-2 py-1 rounded text-xs font-semibold`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => navigate(`${detailPath}/${order.orderId}`)}
                                        className="bg-blue-900 text-white px-3 py-1 rounded text-xs hover:opacity-90"
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="py-4 text-gray-500 italic">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTableDistributor;
