// src/components/Pabrik/TableProduksiPengiriman.jsx
import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
import { useProduksiPengiriman } from '../../../../hooks/Pabrik/useProduksiPengiriman';
import StatusBadge from '../../Common/StatusBadge';

const TableProduksiPengiriman = () => {
  const {
    filteredOrders,
    handleDetail,
    getStatusPengirimanText,
    isInvoiceEnabled,
  } = useProduksiPengiriman();

  const columns = [
    { label: 'No', key: 'no' },
    { label: 'Order ID', key: 'orderId' },
    { label: 'Agen', key: 'agentName' },
    { label: 'Distributor', key: 'distributor' },
    { label: 'Alamat Agen', key: 'alamat' },
    { label: 'Jumlah Produk', key: 'jumlahProduk' },
    // {
    //   label: 'Status Produksi',
    //   key: 'statusProduksi',
    //   render: (value) => <StatusBadge status={value} type="produksi" />,
    // },
    {
      label: 'Status Produksi',
      key: 'statusProduksi',
      render: (_, row) => (
        <StatusBadge
          status={row.statusProduksi}           // ini buat warna
          labelOverride={row.statusProduksiText} // ini buat teks custom
        />
      ),
    },



    {
      label: 'Status Pengiriman',
      key: 'statusPengiriman',
      render: (_, row) => (
        <StatusBadge
          status={getStatusPengirimanText(row)}
          type="pengiriman"
        />
      ),
    },
    {
      label: 'Aksi',
      key: 'aksi',
      render: (_, order) => {
        const invoiceEnabled = isInvoiceEnabled(order);
        return (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleDetail(order)}
              className="bg-btn-dark text-white px-3 py-1 rounded text-xs hover:bg-gray-800"
            >
              Detail
            </button>
            <button
              disabled={!invoiceEnabled}
              className={`px-3 py-1 rounded text-xs ${
                invoiceEnabled
                  ? 'bg-btn-dark text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Buat Invoice
            </button>
          </div>
        );
      },
    },
  ];

  const dataWithIndex = filteredOrders.map((order, idx) => ({
    ...order,
    no: idx + 1,
    jumlahProduk:
      order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0,
  }));

  return (
    <div className="rounded border border-gray-200 shadow overflow-hidden">
      <ReusableTable
        columns={columns}
        data={dataWithIndex}
        className="text-sm text-center"
      />
    </div>
  );
};

export default TableProduksiPengiriman;
