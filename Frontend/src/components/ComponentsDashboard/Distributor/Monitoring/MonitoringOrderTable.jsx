import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusLabel from './StatusLabel';

const MonitoringOrderTable = ({ orders }) => {
    const navigate = useNavigate();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-center">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="px-4 py-2 border-b">No</th>
                        <th className="px-4 py-2 border-b">Order ID</th>
                        <th className="px-4 py-2 border-b">Agen ID</th>
                        <th className="px-4 py-2 border-b">Pabrik ID</th>
                        <th className="px-4 py-2 border-b">Tanggal Order</th>
                        <th className="px-4 py-2 border-b">Estimasi Sampai</th>
                        <th className="px-4 py-2 border-b">Status Order</th>
                        <th className="px-4 py-2 border-b">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order.orderId} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{order.orderId}</td>
                            <td className="px-4 py-2">{order.agenId || 'AG-001'}</td>
                            <td className="px-4 py-2">{order.pabrikId || 'PB-001'}</td>
                            <td className="px-4 py-2">{order.orderDate}</td>
                            <td className="px-4 py-2">{order.estimatedDate || '-'}</td>
                            <td className="px-4 py-2">
                                <StatusLabel status={order.status} />
                            </td>
                            <td className="px-4 py-2 flex justify-center gap-2">
                                <button
                                    className="bg-blue-800 text-white px-3 py-1 rounded text-sm hover:opacity-90 font-bold"
                                    onClick={() => navigate(`/distributor/monitoring-order/detail/${order.orderId}`)}
                                >
                                    Detail
                                </button>
                                <button
                                    className="bg-indigo-900 text-white px-3 py-1 rounded text-sm hover:opacity-90 font-bold"
                                >
                                    Buat Invoice
                                </button>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan="8" className="py-4 text-gray-500 italic">
                                Tidak ada data order.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MonitoringOrderTable;
