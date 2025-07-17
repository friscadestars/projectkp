import React from 'react';

const TableDaftarOrderMasuk = ({ orders, onDetail }) => {

    return (
        <div className="rounded-xl border border-gray-200 shadow overflow-hidden">
            <table className="min-w-full text-sm text-center whitespace-nowrap rounded-lg border border-gray-200 shadow">
                <thead>
                    <tr className="bg-primary-dark text-white">
                        <th className="px-4 py-2">No</th>
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Distributor</th>
                        <th className="px-4 py-2">Agen ID</th>
                        <th className="px-4 py-2">Alamat Agen</th>
                        <th className="px-4 py-2">Jumlah</th>
                        <th className="px-4 py-2">Tanggal Order</th>
                        <th className="px-4 py-2">Status Order</th>
                        <th className="px-4 py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{order.orderId}</td>
                                <td className="px-4 py-2">{order.distributor}</td>
                                <td className="px-4 py-2">{order.agentId}</td>
                                <td className="px-4 py-2">{order.agenAddress}</td>
                                <td className="px-4 py-2">{order.jumlahProduk}</td>
                                <td className="px-4 py-2">{order.orderDate}</td>
                                <td className="px-4 py-2">
                                    <span className="bg-btn-danger text-white px-3 py-1 rounded text-xs">
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => onDetail(order)}
                                        className="px-3 py-1 bg-primary-dark text-white rounded hover:bg-primary-darkest cursor-pointer"
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="py-4 text-gray-500 italic">
                                Tidak ada order masuk.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableDaftarOrderMasuk;
