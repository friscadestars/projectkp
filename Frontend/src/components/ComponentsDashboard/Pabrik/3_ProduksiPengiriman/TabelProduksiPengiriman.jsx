// import React from 'react';
// import ReusableTable from '../../Common/ReusableTable'; 
// import { useProduksiPengiriman } from '../../../../hooks/Pabrik/useProduksiPengiriman';

// const TableProduksiPengiriman = () => {
//   const {
//     filteredOrders,
//     handleDetail,
//     getStatusProduksiClass,
//     getStatusPengirimanClass,
//     getStatusPengirimanText,
//     isInvoiceEnabled,
//   } = useProduksiPengiriman();

//   const columns = [
//     { label: 'No', key: 'no' },
//     { label: 'Order ID', key: 'orderId' },
//     { label: 'Agen ID', key: 'agentId' },
//     { label: 'Distributor', key: 'distributor' },
//     { label: 'Alamat', key: 'agentAddress' },
//     { label: 'Jumlah Produk', key: 'jumlahProduk' },
//     { label: 'Status Produksi', key: 'statusProduksi' },
//     { label: 'Status Pengiriman', key: 'statusPengiriman' },
//     { label: 'Aksi', key: 'aksi' },
//   ];

//   const renderRow = (order, index) => {
//     const pengirimanText = getStatusPengirimanText(order);
//     const invoiceEnabled = isInvoiceEnabled(order);

//     return (
//       <>
//         <td>{index + 1}</td>
//         <td>{order.orderId}</td>
//         <td>{order.agentId}</td>
//         <td>{order.distributor}</td>
//         <td>{order.agentAddress || '-'}</td>
//         <td>{order.products?.reduce((sum, p) => sum + p.quantity, 0)}</td>
//         <td>
//           <span className={`px-3 py-1 whitespace-nowrap rounded text-xs text-white ${getStatusProduksiClass(order.status)}`}>
//             {order.status}
//           </span>
//         </td>
//         <td>
//           <span className={`px-3 py-1 whitespace-nowrap rounded text-xs text-white ${getStatusPengirimanClass(order)}`}>
//             {pengirimanText}
//           </span>
//         </td>
//         <td>
//           <div className="flex justify-center gap-2">
//             <button
//               onClick={() => handleDetail(order)}
//               className="bg-btn-dark text-white px-3 py-1 rounded text-xs hover:bg-gray-800"
//             >
//               Detail
//             </button>
//             <button
//               disabled={!invoiceEnabled}
//               className={`px-3 py-1 rounded text-xs ${
//                 invoiceEnabled
//                   ? 'bg-btn-dark text-white hover:bg-gray-800'
//                   : 'bg-gray-300 text-gray-600 cursor-not-allowed'
//               }`}
//             >
//               Buat Invoice
//             </button>
//           </div>
//         </td>
//       </>
//     );
//   };

//   return (
//     <div className="rounded border border-gray-200 shadow overflow-hidden">
//       <ReusableTable
//         columns={columns}
//         data={filteredOrders}
//         renderRow={renderRow}
//         className="text-sm text-center"
//       />
//     </div>
//   );
// };

// export default TableProduksiPengiriman;


// ============

// import React from "react";
// import { useProduksiPengiriman } from '../../../../hooks/Pabrik/useProduksiPengiriman';

// export default function TableProduksiPengiriman() {
//   const { data } = useProduksiPengiriman();



//   return (
//     <div className="overflow-x-auto">
//       <table className="table-auto w-full border border-gray-300">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-4 py-2 border">No</th>
//             <th className="px-4 py-2 border">Order ID</th>
//             <th className="px-4 py-2 border">Distributor</th>
//             <th className="px-4 py-2 border">Agen</th>
//             <th className="px-4 py-2 border">Alamat Agen</th>
//             <th className="px-4 py-2 border">Jumlah</th>
//             <th className="px-4 py-2 border">Tanggal Order</th>
//             <th className="px-4 py-2 border">Status Order</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={item.id}>
//               <td className="px-4 py-2 border">{index + 1}</td>
//               <td className="px-4 py-2 border">{item.order_id}</td>
//               <td className="px-4 py-2 border">{item.distributor}</td>
//               <td className="px-4 py-2 border">{item.agen}</td>
//               <td className="px-4 py-2 border">{item.alamat_agen}</td>
//               <td className="px-4 py-2 border">{item.jumlah}</td>
//               <td className="px-4 py-2 border">{item.tanggal_order}</td>
//               <td className="px-4 py-2 border">{item.status_order}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// ======================

// src/components/Pabrik/TableProduksiPengiriman.jsx
import React from 'react';
import ReusableTable from '../../Common/ReusableTable';
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
    { label: 'Agen', key: 'agentName' },
    { label: 'Distributor', key: 'distributor' },
    { label: 'Alamat', key: 'alamat' },
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
        <td>{order.agentName}</td>
        <td>{order.distributor}</td>
        <td>{order.alamat || '-'}</td>
        <td>{order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0)}</td>
        <td>
          <span className={`px-3 py-1 whitespace-nowrap rounded text-xs text-white ${getStatusProduksiClass(order.statusProduksi)}`}>
            {order.statusProduksi}
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
    <div className="rounded border border-gray-200 shadow overflow-hidden">
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
