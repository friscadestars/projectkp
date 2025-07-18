import React from "react";

const TabelMonitoringDistributor = ({ orders }) => {
  console.log('Orders (distributor list) received by table:', orders);

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
          {orders.map((order, index) => (
            <tr key={order.distributorId}>
              <td>{index + 1}</td>
              <td>{order.distributorId}</td>
              <td>{order.distributor}</td>
              <td>{order.email || "-"}</td>
              <td>{order.noRek || "-"}</td>
              <td>{order.address || "-"}</td>
              <td>{order.lastOrder || "-"}</td>
              <td>
                <span className={`status-badge ${order.isActive ? "status-approved" : "status-default"}`}>
                  {order.isActive ? "Aktif" : "Tidak Aktif"}
                </span>
              </td>
              <td>
                <button
                  className={`agen-button-toggle ${order.isActive ? "btn-hentikan" : "btn-aktifkan"}`}
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
