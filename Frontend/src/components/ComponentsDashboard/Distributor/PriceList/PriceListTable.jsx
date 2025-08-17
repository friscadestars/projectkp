// src/Components/Distributor/PabrikPriceList/PriceListTable.jsx
import React, { useState } from 'react';
import ReusableTable from '../../Common/ReusableTable';

const formatRupiah = (value) => {
    if (!value) return 'Rp. 0';
    const number = parseInt(value.toString().replace(/\D/g, ''), 10);
    return 'Rp. ' + number.toLocaleString('id-ID');
};

const parseRupiah = (value) => {
    return value.toString().replace(/[^0-9]/g, '') || '0';
};

const PriceListTable = ({
    filteredProduk,
    handleEdit,
    handleSave,
    handleDelete,
    loading,
    hargaHeader = "Harga Pabrik",
    canEdit = true
}) => {
    const [editedValues, setEditedValues] = useState({});

    const handleInputChange = (id, field, value) => {
        setEditedValues(prev => {
            const existing = prev[id] || {};
            return {
                ...prev,
                [id]: {
                    ...existing,
                    [field]: value
                }
            };
        });

        if (typeof handleEdit === 'function') {
            handleEdit(id);
        }
    };

    const handleSaveClick = (row) => {
        const edits = editedValues[row.id] || {};

        const updated = {
            nama_produk: edits.nama_produk || row.nama_produk,
            kode_produk: edits.kode_produk || row.kode_produk,
            harga: parseInt(parseRupiah(edits.harga || row.harga), 10)
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
            render: (_, row) =>
                row.isEditing && canEdit ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded text-sm w-32"
                        value={editedValues[row.id]?.nama_produk ?? row.nama_produk}
                        onChange={(e) => handleInputChange(row.id, 'nama_produk', e.target.value)}
                    />
                ) : row.nama
        },
        {
            header: 'Kode Produk',
            key: 'kode_produk',
            render: (_, row) =>
                row.isEditing && canEdit ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded text-sm w-24"
                        value={editedValues[row.id]?.kode_produk ?? row.kode_produk}
                        onChange={(e) => handleInputChange(row.id, 'kode_produk', e.target.value)}
                    />
                ) : row.kode
        },
        {
            header: hargaHeader,
            key: 'harga',
            render: (value, row) =>
                row.isEditing && canEdit ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded text-sm w-28 text-center"
                        value={editedValues[row.id]?.harga ?? formatRupiah(value.toString())}
                        onChange={(e) => handleInputChange(row.id, 'harga', e.target.value)}
                    />
                ) : (
                    `Rp. ${Number(value).toLocaleString('id-ID')}`
                )
        }
    ];

    if (canEdit) {
        columns.push({
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
                            onClick={() => {
                                setEditedValues(prev => ({
                                    ...prev,
                                    [row.id]: {
                                        nama_produk: row.nama,
                                        kode_produk: row.kode,
                                        harga: row.harga
                                    }
                                }));
                                handleEdit(row.id);
                            }}
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
        });
    }

    return (
        <div className="mt-4">
            <ReusableTable
                columns={columns}
                data={filteredProduk}
                loading={loading}
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
