import React from "react";

const TabelMonitoringDistributor = ({ orders }) => {
  console.log('Orders (distributor list) received by table:', orders);

  return (
    <div className="rounded-lg border border-gray-200 shadow overflow-hidden">
      <table className="min-w-full text-sm text-center">
        <thead className="bg-primary-dark text-white">
          <tr>
            <th className="px-4 py-2">No</th>
            <th className="px-4 py-2">Distributor ID</th>
            <th className="px-4 py-2">Nama Distributor</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">No. Rekening</th>
            <th className="px-4 py-2">Alamat</th>
            <th className="px-4 py-2">Terakhir Order</th>
            <th className="px-4 py-2">Status Keaktifan</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.distributorId} className="border-b border-gray-300 hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{order.distributorId}</td>
              <td className="px-4 py-2">{order.distributor}</td>
              <td className="px-4 py-2">{order.email || "-"}</td>
              <td className="px-4 py-2">{order.noRek || "-"}</td>
              <td className="px-4 py-2">{order.address || "-"}</td>
              <td className="px-4 py-2">{order.lastOrder || "-"}</td>
              <td className="px-4 py-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    order.isActive ? "bg-btn-info text-white" : "bg-btn-disabled text-white"
                  }`}
                >
                  {order.isActive ? "Aktif" : "Tidak Aktif"}
                </span>
              </td>
              <td className="px-4 py-2">
                <button
                  className={`px-3 py-1 rounded ${
                    order.isActive ? "bg-btn-warning text-white" : "bg-btn-success text-white"
                  }`}
                >
                  {order.isActive ? "Hentikan" : "Aktifkan"}
                </button>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="9" className="py-4 text-gray-500">
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
