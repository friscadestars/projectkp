// src/Components/Distributor/Agen/AgenTable.jsx
import React from "react";
import ReusableTable from "../../../Common/ReusableTable";

const AgenTable = ({ agenList, toggleAktif }) => {
    const columns = [
        {
            header: "No",
            key: "no",
            render: (_, __, index) => index + 1,
        },
        { header: "Nama Agen", key: "name" },
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
                    className={`agen-status ${val ? 'aktif' : 'nonaktif'} text-xs px-2 py-1 rounded font-bold`}
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
                        className={`agen-button-toggle ${row.aktif ? 'btn-hentikan' : 'btn-aktifkan'} text-xs px-2 py-1`}
                        onClick={() => toggleAktif(row.id)}
                    >
                        {row.aktif ? "Hentikan" : "Aktifkan"}
                    </button>
                    <button
                        className="agen-button-edit bg-blue-900 text-white text-xs px-2 py-1 rounded font-bold"
                        onClick={() => row.onEdit(row.id)}

                    >
                        Edit
                    </button>
                    <button
                        className="agen-button-delete bg-blue-900 text-white text-xs px-2 py-1 rounded font-bold"
                        onClick={() => row.onDelete(row.id)}
                    >
                        Hapus
                    </button>
                </div>
            ),
        }
    ];

    return (
        <ReusableTable
            columns={columns}
            data={agenList}
            footer={
                <tr>
                    <td
                        colSpan={columns.length}
                        className="px-4 py-3 text-sm text-right font-medium text-gray-600 border-t border-gray-300"
                    >
                        Total Agen: {agenList.length}
                    </td>
                </tr>
            }
        />
    );
};

export default AgenTable;
