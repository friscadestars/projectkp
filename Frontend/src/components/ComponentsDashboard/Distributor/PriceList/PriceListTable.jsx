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
    const [editedPrices, setEditedPrices] = useState({});

    const handleInputChange = (id, value) => {
        const formatted = formatRupiah(value);
        setEditedPrices((prev) => ({
            ...prev,
            [id]: formatted
        }));
    };

    const handleSaveClick = (id) => {
        const rawValue = parseInt(parseRupiah(editedPrices[id] || ''), 10);
        handleSave(id, rawValue || 0);
        setEditedPrices((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
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
            key: 'nama'
        },
        {
            header: 'Kode Produk',
            key: 'kode'
        },
        {
            header: hargaHeader,
            key: 'harga',
            render: (value, row) =>
                row.isEditing ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded text-sm w-24 text-center"
                        value={editedPrices[row.id] ?? formatRupiah(value.toString())}
                        onChange={(e) => handleInputChange(row.id, e.target.value)}
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
                            onClick={() => handleSaveClick(row.id)}
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
