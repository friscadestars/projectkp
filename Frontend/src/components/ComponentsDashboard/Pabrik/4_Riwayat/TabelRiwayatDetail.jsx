// src/components/ComponentsDashboard/Pabrik/4_Riwayat/TabelRiwayatDetail.jsx
import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const safeDateStr = dateStr.replace(' ', 'T');
  const date = new Date(safeDateStr);

  if (isNaN(date)) return '-';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const getStatusPembayaran = (_, row) => {
  const status = (
    row.statusPembayaran ||
    row.status_pembayaran ||
    row.invoice_status ||
    ''
  ).toLowerCase();

  if (status === 'lunas' || status === 'paid') return 'Lunas';
  if (status === 'belum dibayar' || status === 'belum lunas' || status === 'unpaid')
    return 'Belum Dibayar';
  return '-';
};

const OrderInfoTable = ({ order }) => {
  if (!order) return null;

  const columns = [
    { header: 'Order ID', key: 'orderCode', render: (v) => v?.toUpperCase() },
    { header: 'Agen', key: 'agenName' },
    { header: 'Tanggal Order', key: 'orderDate', render: formatDate },
    { header: 'Tanggal Terima', key: 'receivedDate', render: formatDate },
    {
      header: 'Status Pembayaran',
      key: 'statusPembayaran',
      render: (_, row) => {
        const status = getStatusPembayaran(_, row);
        return (
          <span
            className={`text-white text-sm px-2 py-1 rounded font-bold ${status === 'Lunas' ? 'bg-green-600' : 'bg-red-600'
              }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: 'Status Order',
      key: 'status',
      render: (v) => <StatusBadge status={v} />,
    },
  ];

  const data = [order];

  return (
    <div className="mb-6">
      <h2 className="font-semibold text-md mb-3">Detail Order</h2>
      <ReusableTable columns={columns} data={data} />
    </div>
  );
};

const ProductDetailTable = ({ products }) => {
  const columns = [
    { header: 'Nama Produk', key: 'name' },
    { header: 'Jumlah', key: 'quantity' },
    {
      header: 'Harga Satuan Distributor',
      key: 'unitPrice',
      render: (_, row) => {
        const harga = row.status === 'Tertunda' ? row.requestedPrice : row.unitPrice;
        return typeof harga === 'number'
          ? `Rp. ${harga.toLocaleString('id-ID')}`
          : '-';
      },
    },
    {
      header: 'Harga Satuan Pabrik',
      key: 'hargaPabrik',
      render: (value) =>
        typeof value === 'number'
          ? `Rp. ${value.toLocaleString('id-ID')}`
          : '-',
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="font-semibold text-md mb-3">Rincian Produk</h2>
      <ReusableTable columns={columns} data={products} />
    </div>
  );
};

const TabelRiwayatDetail = ({ order }) => {
  if (!order || !Array.isArray(order.items)) {
    return <div className="text-red-600">Data order belum lengkap.</div>;
  }

  const products = order.items.map((item) => ({
    name: item.product_name,
    quantity: item.quantity,
    requestedPrice: item.requested_price,
    unitPrice: Number(item.unit_price ?? 0),
    status: order.status,
    hargaPabrik: Number(item.harga_pabrik ?? item.hargaPabrik ?? 0), // pastikan ambil dari dua kemungkinan field
  }));

  return (
    <div>
      <OrderInfoTable order={order} />
      <ProductDetailTable products={products} />
    </div>
  );
};

export default TabelRiwayatDetail;
