import React from 'react';
import { useNavigate } from 'react-router-dom';

const RiwayatOrderTable = ({ orders, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-center">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="px-4 py-2 border-b">No</th>
                        <th className="px-4 py-2 border-b">Order ID</th>
                        <th className="px-4 py-2 border-b">Agen ID</th>
                        <th className="px-4 py-2 border-b">Tanggal Order</th>
                        <th className="px-4 py-2 border-b">Tanggal Terima</th>
                        <th className="px-4 py-2 border-b">Subtotal Harga Pabrik</th>
                        <th className="px-4 py-2 border-b">Subtotal Harga Jual</th>
                        <th className="px-4 py-2 border-b">Status Pembayaran</th>
                        <th className="px-4 py-2 border-b">Status Order</th>
                        <th className="px-4 py-2 border-b">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{order.id}</td>
                            <td className="px-4 py-2">{order.agenId}</td>
                            <td className="px-4 py-2">{order.tanggalOrder}</td>
                            <td className="px-4 py-2">{order.tanggalTerima}</td>
                            <td className="px-4 py-2">{order.hargaPabrik}</td>
                            <td className="px-4 py-2">{order.hargaJual}</td>
                            <td className="px-4 py-2">
                                <span className={`text-white text-sm px-2 py-1 rounded font-bold ${order.statusPembayaran === 'Lunas' ? 'bg-green-600' : 'bg-red-600 font-bold'}`}>
                                    {order.statusPembayaran}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                <span className="text-white text-sm px-3 py-1 rounded font-bold bg-blue-600">
                                    {order.statusOrder}
                                </span>
                            </td>
                            <td className="px-4 py-2 flex gap-2 justify-center">
                                <button
                                    className="bg-blue-900 text-white px-3 py-1 text-sm rounded font-bold"
                                    onClick={() => navigate(`/distributor/riwayat-order/detail/${order.id}`)}
                                >
                                    Detail
                                </button>
                                <button
                                    className="bg-red-600 text-white px-3 py-1 text-sm rounded font-bold"
                                    onClick={() => onDelete(order.id)}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RiwayatOrderTable;
