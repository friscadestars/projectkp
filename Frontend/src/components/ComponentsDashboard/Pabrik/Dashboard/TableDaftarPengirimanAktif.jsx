import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge'; 

const TableDaftarPengirimanAktif = ({ orders }) => {
  const columns = [
    { key: 'no', header: 'No' },
    { key: 'orderId', header: 'Order ID' },
    { key: 'agenName', header: 'Agen' },
    { key: 'distributor', header: 'Distributor' },
    { key: 'delivery_date', header: 'Tanggal Kirim' },
    { key: 'products', header: 'Jumlah Produk' },
    { key: 'noResi', header: 'No. Resi' },
    {
      key: 'status',
      header: 'Status Order',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const data = orders.map((order, index) => ({
    no: index + 1,
    orderId: order.orderId,
    agenName: order.agenName,
    distributor: order.distributor,
    delivery_date: order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '-',
    products: order.products.length,
    noResi: order.noResi,
    status: order.status,
  }));

  console.log('orders:', orders);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Daftar Pengiriman Aktif</h2>
      <ReusableTable columns={columns} data={data} />
    </div>
  );
};

export default TableDaftarPengirimanAktif;
