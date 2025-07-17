import React from 'react';

const getStatusClasses = (status) => {
    switch (status) {
        case 'Menunggu Produksi': return 'bg-btn-danger text-white font-bold';
        case 'Diproduksi': return 'bg-yellow-500 text-white font-bold';
        case 'Dikirim': return 'bg-blue-500 text-white font-bold';
        case 'Selesai': return 'bg-green-700 text-white font-bold';
        default: return 'bg-gray-300 text-gray-700 font-bold';
    }
};

const TabelDetailOrder = ({ order }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia.</p>;

    return (
        <div>
            <h2 className="text-lg font-semibold mb-1.5">Detail Order</h2>
            {/* Wrapper tabel dengan rounded */}
            <div className="rounded-xl border border-gray-200 shadow overflow-hidden">
                <table className="min-w-full text-sm text-center whitespace-nowrap">
                    <thead className="bg-primary-dark text-white">
                        <tr>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Distributor</th>
                            <th className="px-4 py-3">Agen ID</th>
                            <th className="px-4 py-3">Alamat Agen</th>
                            <th className="px-4 py-3">Tanggal Order</th>
                            <th className="px-4 py-3">Status Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-300 hover:bg-gray-50">
                            <td className="px-4 py-3">{order.orderId}</td>
                            <td className="px-4 py-3">{order.distributor}</td>
                            <td className="px-4 py-3">{order.agentId}</td>
                            <td className="px-4 py-3">{order.agenAddress}</td>
                            <td className="px-4 py-3">{order.orderDate}</td>
                            <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded bg-red- text-sm ${getStatusClasses(order.status)}`}>
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


export default TabelDetailOrder;
