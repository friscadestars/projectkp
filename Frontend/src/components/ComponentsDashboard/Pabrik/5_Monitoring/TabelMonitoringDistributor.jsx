import React from "react";

const TabelMonitoringDistributor = ({ orders = [], toggleAktif }) => {
  console.log("Orders (distributor list) received by table:", orders);

  return (
    <div className="order-table-container">
      <table className="order-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Distributor ID</th>
            <th>Nama Distributor</th>
            <th>Email</th>
            <th>No. Rekening</th>
            <th>Alamat</th>
            <th>Terakhir Order</th>
            <th>Status Keaktifan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((distributor, index) => (
              <tr key={distributor?.distributorId || index}>
                <td>{index + 1}</td>
                <td>{distributor?.distributorId || "-"}</td>
                <td>{distributor?.distributor || "-"}</td>
                <td>{distributor?.email || "-"}</td>
                <td>{distributor?.noRek || "-"}</td>
                <td>{distributor?.address || "-"}</td>
                <td>{distributor?.lastOrder || "-"}</td>
                <td>
                  <span
                    className={`status-badge ${
                      distributor?.isActive ? "status-approved" : "status-default"
                    }`}
                  >
                    {distributor?.isActive ? "Aktif" : "Tidak Aktif"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleAktif && toggleAktif(distributor?.distributorId)}
                    className={`agen-button-toggle ${
                      distributor?.isActive ? "btn-hentikan" : "btn-aktifkan"
                    }`}
                  >
                    {distributor?.isActive ? "Hentikan" : "Aktifkan"}
                  </button>
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
