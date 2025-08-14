// src/components/ComponentsDashboard/Pabrik/4_Riwayat/TabelRiwayatDetail.jsx
import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import StatusBadge from '../../Common/StatusBadge';

// Format tanggal
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

// Status pembayaran
const getStatusPembayaran = (_, row) => {
  const status = (
    row.paymentStatus ?? row.statusPembayaran ?? row.invoice_status ?? ''
  ).toString().toLowerCase();

  if (status === 'lunas' || status === 'paid') return 'Lunas';
  if (status === 'belum dibayar' || status === 'belum lunas' || status === 'unpaid')
    return 'Belum Dibayar';
  return '-';
};

// Tabel info order
const OrderInfoTable = ({ order }) => {
  if (!order) return null;

  const columns = [
    { header: 'Order ID', key: 'orderCode', render: (v) => v?.toUpperCase() ?? '-' },
    { header: 'Agen', key: 'agenName', render: (v) => v ?? '-' },
    { header: 'Tanggal Order', key: 'orderDate', render: formatDate },
    { header: 'Tanggal Pengiriman', key: 'deliveryDate', render: formatDate },
    {
      header: 'Status Order',
      key: 'status',
      render: (v) => <StatusBadge status={v ?? '-'} />
    },
    {
      header: 'Status Pembayaran',
      key: 'paymentStatus',
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
      }
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="font-semibold text-md mb-3">Detail Order</h2>
      <ReusableTable columns={columns} data={[order]} />
    </div>
  );
};

// Tabel detail produk
const ProductDetailTable = ({ products }) => {
  const columns = [
    { header: 'Nama Produk', key: 'name' },
    { header: 'Jumlah', key: 'quantity' },
    {
      header: 'Harga Satuan Agen',
      key: 'hargaAgen',
      render: (value) => `Rp. ${Number(value ?? 0).toLocaleString('id-ID')}`
    },
    {
      header: 'Harga Satuan Pabrik',
      key: 'hargaPabrik',
      render: (value) => `Rp. ${Number(value ?? 0).toLocaleString('id-ID')}`
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="font-semibold text-md mb-3">Rincian Produk</h2>
      <ReusableTable columns={columns} data={products} />
    </div>
  );
};

// Komponen utama
const TabelRiwayatDetail = ({ order }) => {
  if (!order) return <div className="text-red-600">Data order belum lengkap.</div>;

  // Gunakan order.products atau fallback ke order.items
  const productList = order.products ?? order.items ?? [];
  if (!Array.isArray(productList) || productList.length === 0) {
    return <div className="text-red-600">Data produk belum tersedia.</div>;
  }

  // Mapping produk secara fleksibel
  const products = productList.map((item) => ({
    name: item.product_name ?? item.productName ?? item.nama ?? '-',
    quantity: Number(item.quantity ?? item.jumlah ?? item.qty ?? 0),
    hargaAgen: Number(item.requested_price ?? item.hargaAgen ?? 0),
    hargaPabrik: Number(item.harga_pabrik ?? item.hargaPabrik ?? 0)
  }));

  console.log('Mapped products:', products);

  return (
    <div className="detail-order-container max-w-screen-2xl w-full mx-auto px-4 sm:px-8 lg:px-8">
      <OrderInfoTable order={order} />
      <ProductDetailTable products={products} />
    </div>
  );
};

export default TabelRiwayatDetail;
