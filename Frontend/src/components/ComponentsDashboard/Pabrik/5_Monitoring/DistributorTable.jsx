// src/Components/Pabrik/Distributor/DistributorTable.jsx
import React from "react";
import ReusableTable from "../../Common/ReusableTable";

const DistributorTable = ({ distributorList, toggleAktif }) => {
    const columns = [
        {
            header: "No",
            key: "no",
            render: (_, __, index) => index + 1,
        },
        { header: "Nama Distributor", key: "name" },
        { header: "Email", key: "email" },
        { header: "No. Telepon", key: "telepon" },
        { header: "No.Rek", key: "rekening" },
        { header: "Nama Rekening", key: "namaRekening" },
        { header: "Nama Bank", key: "namaBank" },
        { header: "Alamat", key: "alamat" },
        { header: "Terakhir Order", key: "terakhirOrder" },
        {
            header: "Status Keaktifan",
            key: "aktif",
            render: (val) => (
                <span
                    className={`distributor-status ${val ? 'aktif' : 'nonaktif'} text-xs px-2 py-1 rounded font-bold`}
                >
                    {val ? "Aktif" : "Tidak Aktif"}
                </span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            render: (_, row) => (
                <div className="flex gap-2">
                    <button
                        className={`distributor-button-toggle ${row.aktif ? 'btn-hentikan' : 'btn-aktifkan'} text-xs px-2 py-1`}
                        onClick={() => toggleAktif(row.id)}
                    >
                        {row.aktif ? "Hentikan" : "Aktifkan"}
                    </button>
                    <button
                        className="distributor-button-edit bg-blue-900 text-white text-xs px-2 py-1 rounded font-bold"
                        onClick={() => row.onEdit(row.id)}
                    >
                        Edit
                    </button>
                    <button
                        className="distributor-button-delete bg-blue-900 text-white text-xs px-2 py-1 rounded font-bold"
                        onClick={() => row.onDelete(row.id)}
                    >
                        Hapus
                    </button>
                </div>
            ),
        }
    ];

    console.log(distributorList);

    return (
        <ReusableTable
            columns={columns}
            data={distributorList}
            footer={
                <tr>
                    <td
                        colSpan={columns.length}
                        className="px-4 py-3 text-sm text-right font-medium text-gray-600 border-t border-gray-300"
                    >
                        Total Distributor: {distributorList.length}
                    </td>
                </tr>
            }
        />
    );
};

export default DistributorTable;
``
