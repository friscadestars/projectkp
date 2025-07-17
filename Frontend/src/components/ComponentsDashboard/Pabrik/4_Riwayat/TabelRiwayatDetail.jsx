import React from "react";

const TabelRiwayatDetail = ({ order }) => {
  return (
    <div className="space-y-6">
      {/* Detail Order */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Detail Order</h2>
        <div className="rounded-lg border border-gray-200 shadow overflow-hidden">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-primary-dark text-white">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Agen ID</th>
                <th className="px-4 py-2">Tanggal Order</th>
                <th className="px-4 py-2">Tanggal Pengiriman</th>
                <th className="px-4 py-2">Status Order</th>
                <th className="px-4 py-2">Status Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="px-4 py-2">{order.orderId}</td>
                <td className="px-4 py-2">{order.agentId}</td>
                <td className="px-4 py-2">{order.orderDate}</td>
                <td className="px-4 py-2">{order.shippingDate || "-"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`text-white px-2 py-1 rounded text-sm ${
                      order.status === "Diterima"
                        ? "bg-btn-confirm"
                        : "bg-btn-info"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`text-white px-2 py-1 rounded text-sm ${
                      order.paymentStatus === "Lunas"
                        ? "bg-btn-success"
                        : "bg-btn-danger"
                    }`}
                  >
                    {order.paymentStatus || "Belum Dibayar"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Rincian Produk */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Rincian Produk</h2>
        <div className="rounded-lg border border-gray-200 shadow overflow-hidden">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-primary-dark text-white">
              <tr>
                <th className="px-4 py-2">Nama Produk</th>
                <th className="px-4 py-2">Jumlah</th>
                <th className="px-4 py-2">Harga Satuan Agen</th>
                <th className="px-4 py-2">Harga Satuan Pabrik</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr
                  key={index}
                  className="text-center border-b border-gray-200"
                >
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.quantity}</td>
                  <td className="px-4 py-2">
                    {product.agentPrice
                      ? `Rp ${product.agentPrice.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {product.factoryPrice
                      ? `Rp ${product.factoryPrice.toLocaleString()}`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabelRiwayatDetail;
