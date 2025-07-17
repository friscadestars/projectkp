//import React, { useState } from 'react';
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

  return (
    <div>
      <div className="rounded-xl border border-gray-200 shadow overflow-hidden">
        <table className="min-w-full text-sm text-center ">
          <thead className="bg-primary-dark text-white">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Agen ID</th>
              <th className="px-4 py-2">Distributor</th>
              <th className="px-4 py-2">Alamat</th>
              <th className="px-4 py-2">Jumlah Produk</th>
              <th className="px-4 py-2">Status Produksi</th>
              <th className="px-4 py-2">Status Pengiriman</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => {
                const pengirimanText = getStatusPengirimanText(order);
                const invoiceEnabled = isInvoiceEnabled(order);

                return (
                  <tr key={order.orderId} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{order.orderId}</td>
                    <td className="px-4 py-2">{order.agentId}</td>
                    <td className="px-4 py-2">{order.distributor}</td>
                    <td className="px-4 py-2">{order.agentAddress || '-'}</td>
                    <td className="px-4 py-2">
                      {order.products?.reduce((sum, p) => sum + p.quantity, 0)}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-3 py-1 whitespace-nowrap rounded text-xs text-white ${getStatusProduksiClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-3 py-1 whitespace-nowrap rounded text-xs text-white ${getStatusPengirimanClass(order)}`}>
                        {pengirimanText}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDetail(order)}
                          className="bg-btn-dark text-white px-3 py-1 rounded text-xs hover:bg-gray-800 cursor-pointer "
                        >
                          Detail
                        </button>
                        <button
                          className={`px-3 py-1 rounded text-xs ${
                            invoiceEnabled
                              ? 'bg-btn-dark text-white hover:bg-gray-800 cursor-pointer '
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                          disabled={!invoiceEnabled}
                        >
                          Buat Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="py-4 italic text-gray-500">
                  Tidak ada data order.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableProduksiPengiriman;
