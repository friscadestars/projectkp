import React from 'react';
import ReusableTable from '../../Common/ReusableTable';

const TableDaftarPengirimanAktif = ({ orders }) => {
  const columns = [
    { key: 'no', header: 'No' },
    { key: 'orderId', header: 'Order ID' },
    { key: 'agentId', header: 'Agen ID' },
    { key: 'distributorId', header: 'Distributor ID' },
    { key: 'tanggalKirim', header: 'Tanggal Kirim' },
    { key: 'jumlahProduk', header: 'Jumlah Produk' },
    { key: 'noResi', header: 'No. Resi' },
    {
      key: 'status',
      header: 'Status Order',
      render: (value) => {
        const badgeColor =
          value === 'Dikirim'
            ? 'bg-cyan-500 text-white'
            : value === 'Diterima'
            ? 'bg-green-500 text-white'
            : value === 'Diproduksi'
            ? 'bg-yellow-500 text-primary-darkest'
            : '';

        return (
          <span className={`px-3 py-1 rounded text-sm font-bold ${badgeColor}`}>
            {value}
          </span>
        );
      },
    },
  ];

  const data = orders.map((order, index) => ({
    no: index + 1,
    orderId: order.orderId,
    agentId: order.agentId,
    distributorId: order.distributorId,
    tanggalKirim: order.tanggalKirim,
    jumlahProduk: order.jumlahProduk,
    noResi: order.noResi || '-',
    status: order.status,
  }));

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Daftar Pengiriman Aktif</h2>
      <ReusableTable columns={columns} data={data} />
    </div>
  );
};

export default TableDaftarPengirimanAktif;
