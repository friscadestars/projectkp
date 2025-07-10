import React from 'react';

const getStatusClasses = (status) => {
    switch (status) {
        case 'Tertunda': return 'bg-yellow-400 text-white font-bold';
        case 'Disetujui': return 'bg-green-500 text-white font-bold';
        case 'Diproses': return 'bg-blue-500 text-white font-bold';
        case 'Ditolak': return 'bg-red-500 text-white font-bold';
        case 'Dikirim': return 'bg-cyan-500 text-white font-bold';
        case 'Selesai': return 'bg-green-700 text-white font-bold';
        default: return 'bg-gray-300 text-gray-700 font-bold';
    }
};

const DetailOrderInfo = ({ order }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia.</p>;

    return (
        <div>
            <h2 className="text-lg font-semibold mb-3">Detail Order</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-center mt-4 border-collapse">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Distributor</th>
                            <th className="px-4 py-3">Alamat</th>
                            <th className="px-4 py-3">Tanggal Order</th>
                            <th className="px-4 py-3">Estimasi Sampai</th>
                            <th className="px-4 py-3">Status Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-300 hover:bg-gray-50">
                            <td className="px-4 py-3">{order.orderId}</td>
                            <td className="px-4 py-3">{order.distributor || 'Tidak tersedia'}</td>
                            <td className="px-4 py-3">{order.address || 'Alamat tidak tersedia'}</td>
                            <td className="px-4 py-3">{order.orderDate}</td>
                            <td className="px-4 py-3">{order.deliveryEstimate || '-'}</td>
                            <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded text-sm ${getStatusClasses(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetailOrderInfo;
