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
        { header: "No.Rek", key: "rekening" },
        { header: "Nama Rekening", key: "namaRekening" },
        { header: "Nama Bank", key: "namaBank" },
        { header: "Alamat", key: "alamat" },
        { header: "Terakhir Order", key: "terakhirOrder" },
        {
            header: "Status Keaktifan",
            key: "aktif",
            render: (val) => (
                <span className={`agen-status ${val ? 'aktif' : 'nonaktif'}`}>
                    {val ? "Aktif" : "Tidak Aktif"}
                </span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            render: (_, row) => (
                <button
                    className={`agen-button-toggle ${row.aktif ? 'btn-hentikan' : 'btn-aktifkan'}`}
                    onClick={() => toggleAktif(row.id)}
                >
                    {row.aktif ? "Hentikan" : "Aktifkan"}
                </button>
            ),
        },
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
