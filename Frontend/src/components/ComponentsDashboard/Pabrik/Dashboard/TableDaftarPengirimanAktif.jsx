import React from 'react';

const TableDaftarPengirimanAktif = ({ orders }) => (
    <div className="overflow-x-auto max-w-full">
        <h2 className="text-lg font-semibold mb-4 mt-6">Daftar Pengiriman Aktif</h2>

        {/* Wrapper tabel dengan rounded */}
        <div className="rounded-lg border border-gray-200 shadow overflow-hidden">
            <table className="min-w-full text-sm text-center whitespace-nowrap">
                <thead>
                    <tr className="bg-primary-dark text-white">
                        <th className="px-2 py-2 md:px-4 md:py-3">No</th>
                        <th className="px-2 py-2 md:px-4 md:py-3">Order ID</th>
                        <th className="px-2 py-2 md:px-4 md:py-3">Agen ID</th>
                        <th className="px-2 py-2 md:px-4 md:py-3">Distributor ID</th>
                        <th className="px-2 py-2 md:px-4 md:py-3">Tanggal Kirim</th>
                        <th className="px-2 py-2 md:px-4 md:py-3">Jumlah Produk</th>
                        <th className="px-2 py-2 md:px-4 md:py-3">No. Resi</th>
                        <th className="px-2 py-2 md:px-4 md:py-3">Status Order</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                                <td className="px-2 py-2 md:px-4 md:py-3">{index + 1}</td>
                                <td className="px-2 py-2 md:px-4 md:py-3">{order.orderId}</td>
                                <td className="px-2 py-2 md:px-4 md:py-3">{order.agentId}</td>
                                <td className="px-2 py-2 md:px-4 md:py-3">{order.distributorId}</td>
                                <td className="px-2 py-2 md:px-4 md:py-3">{order.tanggalKirim}</td>
                                <td className="px-2 py-2 md:px-4 md:py-3">{order.jumlahProduk}</td>
                                <td className="px-2 py-2 md:px-4 md:py-3">{order.noResi || '-'}</td>
                                <td className="px-2 py-2 md:px-4 md:py-3">
                                    <span
                                        className={`px-3 py-1 rounded text-sm font-bold 
                                            ${order.status === 'Dikirim' ? 'bg-cyan-500 text-white' : ''}
                                            ${order.status === 'Diterima' ? 'bg-green-500 text-white' : ''}
                                            ${order.status === 'Diproduksi' ? 'bg-yellow-500 text-primary-darkest' : ''}
                                        `}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="py-4 text-gray-500 italic">
                                Tidak ada pengiriman aktif.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default TableDaftarPengirimanAktif;
