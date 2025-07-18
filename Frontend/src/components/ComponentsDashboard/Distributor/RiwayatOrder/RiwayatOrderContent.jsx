import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // ✅ import sweetalert2
import ReusableTable from '../../Common/ReusableTable';

const RiwayatOrderContent = ({ entries, onEntriesChange, orders, onDelete }) => {
    const navigate = useNavigate();

    const handleDelete = (id) => {
    Swal.fire({
        title: 'Yakin ingin menghapus?',
        text: 'Data yang sudah dihapus tidak dapat dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',  // hijau untuk konfirmasi hapus
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            onDelete(id);
            Swal.fire({
                title: 'Terhapus!',
                text: 'Riwayat order berhasil dihapus.',
                icon: 'success',
                confirmButtonColor: '#2563eb', // biru
            });
        }
    });
};


    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1,
        },
        { header: 'Order ID', key: 'id' },
        { header: 'Agen ID', key: 'agenId' },
        { header: 'Tanggal Order', key: 'tanggalOrder' },
        { header: 'Tanggal Terima', key: 'tanggalTerima' },
        {
            header: 'Subtotal Harga Pabrik',
            key: 'hargaPabrik',
            render: (val) => `Rp. ${Number(val).toLocaleString('id-ID')}`,
        },
        {
            header: 'Subtotal Harga Jual',
            key: 'hargaJual',
            render: (val) => `Rp. ${Number(val).toLocaleString('id-ID')}`,
        },
        {
            header: 'Status Pembayaran',
            key: 'statusPembayaran',
            render: (val) => (
                <span
                    className={`text-white text-sm px-2 py-1 rounded font-bold ${
                        val === 'Lunas' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                >
                    {val}
                </span>
            ),
        },
        {
            header: 'Status Order',
            key: 'statusOrder',
            render: (val) => (
                <span className="text-white text-sm px-3 py-1 rounded font-bold bg-blue-600">
                    {val}
                </span>
            ),
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <div className="flex gap-2 justify-center">
                    <button
                        className="bg-blue-900 text-white px-3 py-1 text-sm rounded font-bold"
                        onClick={() => navigate(`/distributor/riwayat-order/detail/${row.id}`)}
                    >
                        Detail
                    </button>
                    <button
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded font-bold"
                        onClick={() => handleDelete(row.id)} // ✅ pakai sweetalert handler
                    >
                        Hapus
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            {/* Filter Bar */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <input type="date" className="border border-gray-300 rounded px-2 py-1 text-sm" />
                    <span>-</span>
                    <input type="date" className="border border-gray-300 rounded px-2 py-1 text-sm" />
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">Filter</button>
                    <button className="bg-blue-900 text-white px-3 py-1 rounded text-sm font-bold">Export Excel</button>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="entries" className="text-sm">Show</label>
                    <select
                        id="entries"
                        value={entries}
                        onChange={(e) => onEntriesChange(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-sm">entries</span>
                </div>
            </div>

            {/* Table */}
            <div className="mt-4">
                <ReusableTable
                    columns={columns}
                    data={orders}
                    footer={
                        <tr className="px-4 py-3 text-right text-gray-600 font-medium">
                            <td colSpan={columns.length} className="py-2 px-4 text-right">
                                Total Riwayat Order: {orders.length}
                            </td>
                        </tr>
                    }
                />
            </div>
        </div>
    );
};

export default RiwayatOrderContent;
