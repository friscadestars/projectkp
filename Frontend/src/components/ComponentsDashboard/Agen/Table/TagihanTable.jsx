import React from 'react';
import { useNavigate } from 'react-router-dom';

const parseDate = (dateString) => {
    if (!dateString || dateString === '-') return new Date(0);
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
};

const getStatusOrderClasses = (status) => {
    switch (status) {
        case 'Selesai': return 'bg-green-700 text-white font-bold';
        case 'Dikirim': return 'bg-[#17A2B8] text-white font-bold';
        case 'Diproses': return 'bg-blue-500 text-white font-bold';
        case 'Disetujui': return 'bg-green-500 text-white font-bold';
        case 'Ditolak': return 'bg-red-500 text-white';
        case 'Diterima': return 'bg-green-700 text-white font-bold';
        default: return '';
    }
};

const getStatusPembayaranClasses = (status) => {
    if (status === 'Lunas') return 'bg-green-600 text-white';
    if (status === 'Belum Lunas') return 'bg-red-600 text-white';
    return 'bg-gray-400 text-white';
};

const TagihanTable = ({ orders, searchTerm, role }) => {
    const navigate = useNavigate();

    const filteredTagihan = orders
        .filter(order =>
            ['Dikirim', 'Selesai', 'Diterima'].includes(order.status) &&
            (
                order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.distributor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.status.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .sort((a, b) => {
            const orderIdNumA = parseInt(a.orderId?.split('-')[1] || 0);
            const orderIdNumB = parseInt(b.orderId?.split('-')[1] || 0);
            return orderIdNumB - orderIdNumA;
        });

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-base text-sm text-center">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="px-4 py-2 rounded-tl-md">No</th>
                        <th className="px-4 py-2">Order ID</th>
                        {role === 'distributor' ? (
                            <>
                                <th className="px-4 py-2">Agen ID</th>
                                <th className="px-4 py-2">Pabrik ID</th>
                            </>
                        ) : (
                            <th className="px-4 py-2">Distributor</th>
                        )}
                        <th className="px-4 py-2">Tanggal Order</th>
                        <th className="px-4 py-2">Estimasi Sampai</th>
                        <th className="px-4 py-2">Status Order</th>
                        <th className="px-4 py-2">Status Pembayaran</th>
                        <th className="px-4 py-2 rounded-tr-md">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTagihan.length > 0 ? (
                        filteredTagihan.map((item, index) => (
                            <tr key={item.orderId} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{item.orderId}</td>

                                {role === 'distributor' ? (
                                    <>
                                        <td className="px-4 py-2">{item.agenId}</td>
                                        <td className="px-4 py-2">{item.pabrikId}</td>
                                    </>
                                ) : (
                                    <td className="px-4 py-2">{item.distributor}</td>
                                )}

                                <td className="px-4 py-2">{item.orderDate}</td>
                                <td className="px-4 py-2">{item.deliveryEstimate || '-'}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-3 py-1 rounded text-sm font-bold ${getStatusOrderClasses(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <span className={`px-3 py-1 rounded text-sm font-bold ${getStatusPembayaranClasses(item.statusPembayaran || 'Belum Lunas')}`}>
                                        {item.statusPembayaran || 'Belum Lunas'}
                                    </span>
                                </td>
                                <td className="px-4 py-2 flex justify-center gap-2">
                                    <button
                                        onClick={() => {
                                            if (role === 'distributor') {
                                                navigate(`/distributor/invoice/${item.orderId}`, {
                                                    state: { tagihan: item },
                                                });
                                            } else {
                                                navigate('/agen/invoice-tagihan', {
                                                    state: {
                                                        tagihan: item,
                                                        orderId: item.orderId,
                                                    },
                                                });
                                            }
                                        }}
                                        className="bg-blue-900 text-white px-3 py-1 rounded text-sm hover:bg-blue-800 font-bold"
                                    >
                                        Invoice
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                                Tidak ada tagihan ditemukan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TagihanTable;
