import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../Distributor/ValidasiOrder/StatusBadge';

const DistributorKirimOrderTable = ({ orders }) => {
    const navigate = useNavigate();

    const handleDetailClick = (orderId) => {
        if (orderId) {
            navigate(`/distributor/detail-kirim/${orderId}`);
        } else {
            console.warn('Order ID tidak ditemukan!');
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-center">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="px-4 py-2 border-b border-gray-300">No</th>
                        <th className="px-4 py-2 border-b border-gray-300">Order ID</th>
                        <th className="px-4 py-2 border-b border-gray-300">Agen ID</th>
                        <th className="px-4 py-2 border-b border-gray-300">Alamat</th>
                        <th className="px-4 py-2 border-b border-gray-300">Tanggal Order</th>
                        <th className="px-4 py-2 border-b border-gray-300">Jumlah Produk</th>
                        <th className="px-4 py-2 border-b border-gray-300">Status Order</th>
                        <th className="px-4 py-2 border-b border-gray-300">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <tr key={order.orderId} className="border-b border-gray-300 hover:bg-gray-50">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{order.orderId || '-'}</td>
                                <td className="px-4 py-2">{order.agenId || 'AG-001'}</td>
                                <td className="px-4 py-2">{order.alamat || 'Jl. Melati no.20 Jakarta'}</td>
                                <td className="px-4 py-2">{order.orderDate || '-'}</td>
                                <td className="px-4 py-2">
                                    {Array.isArray(order.products)
                                        ? order.products.reduce((sum, p) => sum + p.quantity, 0)
                                        : 0}
                                </td>
                                <td className="px-4 py-2">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDetailClick(order.orderId)}
                                        className="bg-blue-900 text-white px-3 py-1 rounded text-xs hover:opacity-90"
                                        style={{ position: 'relative', zIndex: 10 }}
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="py-4 text-gray-500 italic border-b border-gray-300">
                                Tidak ada order yang disetujui.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DistributorKirimOrderTable;
