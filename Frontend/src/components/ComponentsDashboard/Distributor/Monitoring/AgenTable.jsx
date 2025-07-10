import React from "react";

const AgenTable = ({ agenList, toggleAktif }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-center">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="px-4 py-2 border-b">No</th>
                        <th className="px-4 py-2 border-b">Nama Agen</th>
                        <th className="px-4 py-2 border-b">Email</th>
                        <th className="px-4 py-2 border-b">No.Rek</th>
                        <th className="px-4 py-2 border-b">Nama Rekening</th>
                        <th className="px-4 py-2 border-b">Nama Bank</th>
                        <th className="px-4 py-2 border-b">Alamat</th>
                        <th className="px-4 py-2 border-b">Terakhir Order</th>
                        <th className="px-4 py-2 border-b">Status Keaktifan</th>
                        <th className="px-4 py-2 border-b">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {agenList.map((agen, index) => (
                        <tr key={agen.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{agen.name}</td>
                            <td className="px-4 py-2">{agen.email}</td>
                            <td className="px-4 py-2">{agen.rekening}</td>
                            <td className="px-4 py-2">{agen.namaRekening}</td>
                            <td className="px-4 py-2">{agen.namaBank}</td>
                            <td className="px-4 py-2">{agen.alamat}</td>
                            <td className="px-4 py-2">{agen.terakhirOrder}</td>
                            <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded text-sm font-bold
                                    ${agen.aktif ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                                    {agen.aktif ? 'Aktif' : 'Tidak Aktif'}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                <button
                                    className={`px-3 py-2 rounded text-sm font-bold text-white
                                        ${agen.aktif ? 'bg-red-600 hover:opacity-90' : 'bg-green-600 hover:opacity-90'}`}
                                    onClick={() => toggleAktif(agen.id)}
                                >
                                    {agen.aktif ? 'Hentikan' : 'Aktifkan '}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {agenList.length === 0 && (
                        <tr>
                            <td colSpan="10" className="py-4 text-gray-500 italic">
                                Tidak ada data agen.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AgenTable;
