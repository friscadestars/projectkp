import React from "react";

const TabelMonitoringDistributor = ({ orders = [], toggleAktif, onEditClick }) => {
  return (
    <div className="order-table-container">
      <table className="order-table w-full border-collapse">
        <thead>
          <tr className="bg-blue-900 text-white">
            <th className="p-2">No</th>
            <th className="p-2">Distributor ID</th>
            <th className="p-2">Nama Distributor</th>
            <th className="p-2">Email</th>
            <th className="p-2">No. Rekening</th>
            <th className="p-2">Alamat</th>
            <th className="p-2">Terakhir Order</th>
            <th className="p-2">Status Keaktifan</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((distributor, index) => (
              <tr key={distributor?.distributorId || index} className="text-center border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{distributor?.distributorId || "-"}</td>
                <td className="p-2">{distributor?.distributor || "-"}</td>
                <td className="p-2">{distributor?.email || "-"}</td>
                <td className="p-2">{distributor?.noRek || "-"}</td>
                <td className="p-2">{distributor?.address || "-"}</td>
                <td className="p-2">{distributor?.lastOrder || "-"}</td>
                <td className="p-2">
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded ${
                      distributor?.isActive
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {distributor?.isActive ? "Aktif" : "Tidak Aktif"}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      className={`agen-button-toggle ${distributor?.isActive ? 'btn-hentikan' : 'btn-aktifkan'} text-xs px-2 py-1 rounded font-bold`}
                      onClick={() => toggleAktif(distributor?.distributorId)}
                    >
                      {distributor?.isActive ? "Hentikan" : "Aktifkan"}
                    </button>
                    <button 
                      className="agen-button-edit bg-blue-900 text-white text-xs px-2 py-1 rounded font-bold"
                      onClick={() => onEditClick(distributor)}
                    >
                      Edit
                    </button>
                    <button className="agen-button-delete bg-blue-900 text-white text-xs px-2 py-1 rounded font-bold">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="py-4 text-gray-500 text-center">
                Tidak ada data ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TabelMonitoringDistributor;
