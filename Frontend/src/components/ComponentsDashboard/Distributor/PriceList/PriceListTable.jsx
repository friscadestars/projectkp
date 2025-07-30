import React, { useState } from 'react';
import ReusableTable from '../../Common/ReusableTable';

const formatRupiah = (value) => {
    const numberString = value.replace(/[^,\d]/g, '');
    const number = parseInt(numberString, 10);
    if (isNaN(number)) return '';
    return 'Rp. ' + number.toLocaleString('id-ID');
};

const parseRupiah = (value) => {
    return value.replace(/[^0-9]/g, '');
};

const PriceListTable = ({
    filteredProduk,
    handleEdit,
    handleSave,
    handleDelete,
    hargaHeader = "Harga Pabrik"
}) => {
    const [editedValues, setEditedValues] = useState({});

    const handleInputChange = (id, field, value) => {
        setEditedValues(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: field === 'harga' ? formatRupiah(value) : value
            }
        }));
    };

    const handleSaveClick = (row) => {
        const edits = editedValues[row.id] || {};
        const updated = {
            nama_produk: edits.nama ?? row.nama,
            kode_produk: edits.kode ?? row.kode,
            harga: parseInt(parseRupiah(edits.harga ?? row.harga), 10)
        };

        handleSave(row.id, updated);

        setEditedValues(prev => {
            const next = { ...prev };
            delete next[row.id];
            return next;
        });
    };

    const columns = [
        {
            header: 'No',
            key: 'no',
            render: (_, __, index) => index + 1
        },
        {
            header: 'Nama Produk',
            key: 'nama',
            render: (value, row) =>
                row.isEditing ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded text-sm w-32"
                        value={editedValues[row.id]?.nama ?? value}
                        onChange={(e) => handleInputChange(row.id, 'nama', e.target.value)}
                    />
                ) : value
        },
        {
            header: 'Kode Produk',
            key: 'kode',
            render: (value, row) =>
                row.isEditing ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded text-sm w-24"
                        value={editedValues[row.id]?.kode ?? value}
                        onChange={(e) => handleInputChange(row.id, 'kode', e.target.value)}
                    />
                ) : value
        },
        {
            header: hargaHeader,
            key: 'harga',
            render: (value, row) =>
                row.isEditing ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded text-sm w-28 text-center"
                        value={editedValues[row.id]?.harga ?? formatRupiah(value.toString())}
                        onChange={(e) => handleInputChange(row.id, 'harga', e.target.value)}
                    />
                ) : (
                    `Rp. ${Number(value).toLocaleString('id-ID')}`
                )
        },
        {
            header: 'Aksi',
            key: 'aksi',
            render: (_, row) => (
                <div className="flex justify-center gap-2">
                    {row.isEditing ? (
                        <button
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold"
                            onClick={() => handleSaveClick(row)}
                        >
                            Simpan
                        </button>
                    ) : (
                        <button
                            className="bg-blue-800 text-white px-3 py-1 rounded text-sm font-bold"
                            onClick={() => handleEdit(row.id)}
                        >
                            Edit
                        </button>
                    )}
                    <button
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold"
                        onClick={() => handleDelete(row.id)}
                    >
                        Hapus
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="mt-4">
            <ReusableTable
                columns={columns}
                data={filteredProduk}
                footer={
                    <tr className="border-t border-gray-300">
                        <td colSpan={columns.length}></td>
                    </tr>
                }
            />
        </div>
    );
};

export default PriceListTable;
