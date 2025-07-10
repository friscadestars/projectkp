import React from 'react';

const ShippingStatusTable = ({ orders }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-center">
            <thead>
                <tr className="bg-blue-900 text-white">
                    <th className="px-4 py-2">No</th>
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Distributor</th>
                    <th className="px-4 py-2">Tanggal Kirim</th>
                    <th className="px-4 py-2">Estimasi Sampai</th>
                    <th className="px-4 py-2">Jumlah Produk</th>
                    <th className="px-4 py-2">No. Resi</th>
                    <th className="px-4 py-2">Status Order</th>
                </tr>
            </thead>
            <tbody>
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <tr key={index} className="border-b border-gray-300">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{order.orderId}</td>
                            <td className="px-4 py-2">{order.distributor}</td>
                            <td className="px-4 py-2">{order.orderDate}</td>
                            <td className="px-4 py-2">{order.deliveryEstimate || '-'}</td>
                            <td className="px-4 py-2">{order.products.length}</td>
                            <td className="px-4 py-2">{order.noResi || '-'}</td>
                            <td className="px-4 py-2">
                                <span className={`px-3 py-1 rounded text-sm font-bold 
                                    ${order.status === 'Dikirim' ? 'bg-cyan-500 text-white' : ''}
                                    ${order.status === 'Diterima' ? 'bg-green-500 text-white' : ''}
                                    ${order.status === 'Selesai' ? 'bg-blue-500 text-white' : ''}
                                `}>
                                    {order.status}
                                </span>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="py-4 text-gray-500 italic">
                            Tidak ada pengiriman terbaru.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default ShippingStatusTable;
