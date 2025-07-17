import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiwayatPengiriman } from '../../../../hooks/Pabrik/useRiwayatPengiriman';
import FilterBarRiwayat from '../../Distributor/RiwayatOrder/FilterBarRiwayat';

const TabelRiwayatPengiriman = () => {
  const {
    filteredOrders,
    handleExportExcel,
    formatCurrency,
  } = useRiwayatPengiriman();
  const [entries, setEntries] = useState(10);
  const navigate = useNavigate();

  const handleDetail = (order) => {
    navigate('/pabrik/detail-riwayat', { state: { order } });
  };

  return (
    <div>
      {/* Filter Bar */}
      <FilterBarRiwayat
        entries={entries}
        onEntriesChange={setEntries}
        onExportExcel={handleExportExcel}
      />

      {/* Table */}
      <div className="rounded-lg border border-gray-200 shadow overflow-hidden">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-primary-dark text-white">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Distributor</th>
              <th className="px-4 py-2">Tanggal Kirim</th>
              <th className="px-4 py-2">No. Resi</th>
              <th className="px-4 py-2">Total Harga</th>
              <th className="px-4 py-2">Status Order</th>
              <th className="px-4 py-2">Status Pembayaran</th>
              <th className="px-4 py-2">Tanggal Pembayaran</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.slice(0, entries).map((order, index) => (
              <tr
                key={order.orderId}
                className="border-b border-gray-300 hover:bg-gray-50"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{order.orderId}</td>
                <td className="px-4 py-2">{order.distributor}</td>
                <td className="px-4 py-2">{order.shippingDate || '-'}</td>
                <td className="px-4 py-2">{order.noResi || '-'}</td>
                <td className="px-4 py-2">{formatCurrency(200000)}</td>
                <td className="px-4 py-2">
                  <span
                    className={`text-white text-xs px-2 py-1 rounded ${
                      order.status === 'Dikirim'
                        ? 'bg-btn-info'
                        : order.status === 'Diterima'
                        ? 'bg-btn-confirm'
                        : 'bg-btn-danger'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`text-white text-xs px-2 py-1 rounded ${
                      order.status === 'Diterima'
                        ? 'bg-btn-success'
                        : 'bg-btn-danger'
                    }`}
                  >
                    {order.status === 'Diterima' ? 'Lunas' : 'Belum Dibayar'}
                  </span>
                </td>
                <td className="px-4 py-2">{order.receivedDate || '-'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDetail(order)}
                    className="bg-btn-dark hover:bg-gray-800 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelRiwayatPengiriman;
