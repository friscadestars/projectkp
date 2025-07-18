import React from 'react';
import ReusableTable from '../../Common/ReusableTable'; // ganti path sesuai strukturmu
import { useProduksiPengiriman } from '../../../../hooks/Pabrik/useProduksiPengiriman';

const TableProduksiPengiriman = () => {
  const {
    filteredOrders,
    handleDetail,
    getStatusProduksiClass,
    getStatusPengirimanClass,
    getStatusPengirimanText,
    isInvoiceEnabled,
  } = useProduksiPengiriman();

  const columns = [
    { label: 'No', key: 'no' },
    { label: 'Order ID', key: 'orderId' },
    { label: 'Agen ID', key: 'agentId' },
    { label: 'Distributor', key: 'distributor' },
    { label: 'Alamat', key: 'agentAddress' },
    { label: 'Jumlah Produk', key: 'jumlahProduk' },
    { label: 'Status Produksi', key: 'statusProduksi' },
    { label: 'Status Pengiriman', key: 'statusPengiriman' },
    { label: 'Aksi', key: 'aksi' },
  ];

  const renderRow = (order, index) => {
    const pengirimanText = getStatusPengirimanText(order);
    const invoiceEnabled = isInvoiceEnabled(order);

    return (
      <>
        <td>{index + 1}</td>
        <td>{order.orderId}</td>
        <td>{order.agentId}</td>
        <td>{order.distributor}</td>
        <td>{order.agentAddress || '-'}</td>
        <td>{order.products?.reduce((sum, p) => sum + p.quantity, 0)}</td>
        <td>
          <span className={`px-3 py-1 whitespace-nowrap rounded text-xs text-white ${getStatusProduksiClass(order.status)}`}>
            {order.status}
          </span>
        </td>
        <td>
          <span className={`px-3 py-1 whitespace-nowrap rounded text-xs text-white ${getStatusPengirimanClass(order)}`}>
            {pengirimanText}
          </span>
        </td>
        <td>
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
        </td>
      </>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 shadow overflow-hidden">
      <ReusableTable
        columns={columns}
        data={filteredOrders}
        renderRow={renderRow}
        className="text-sm text-center"
      />
    </div>
  );
};

export default TableProduksiPengiriman;
