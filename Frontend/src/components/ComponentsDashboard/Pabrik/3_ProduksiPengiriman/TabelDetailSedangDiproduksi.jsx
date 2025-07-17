import React, { useState } from 'react';
import Swal from 'sweetalert2';

const TabelDetailSedangDiproduksi = ({ order }) => {
  const { products = [] } = order;

  const [statusProduksi, setStatusProduksi] = useState(order.status);
  const [noResi, setNoResi] = useState('');

  const showConfirmation = async (title, text, confirmButtonText) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // biru
      cancelButtonColor: '#d33',     // merah
      confirmButtonText,
      cancelButtonText: 'Batal',
    });
    return result.isConfirmed;
  };

  const showSuccess = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#3085d6',
    });
  };

  const handleSelesaiProduksi = async () => {
    const confirmed = await showConfirmation(
      'Konfirmasi Selesai Produksi',
      'Apakah Anda yakin ingin menyelesaikan produksi untuk order ini?',
      'Ya, Selesaikan'
    );

    if (confirmed) {
      setStatusProduksi('Selesai Produksi');
      showSuccess('Berhasil!', 'Produksi telah diselesaikan.');
    }
  };

  const handleKirim = async () => {
    if (!noResi) {
      Swal.fire({
        title: 'Nomor Resi Kosong',
        text: 'Silakan masukkan nomor resi sebelum mengirim.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const confirmed = await showConfirmation(
      'Konfirmasi Kirim Order',
      `Apakah Anda yakin ingin mengirim order ${order.orderId} dengan No. Resi ${noResi}?`,
      'Ya, Kirim'
    );

    if (confirmed) {
      setStatusProduksi('Dikirim');
      showSuccess('Berhasil!', `Order ${order.orderId} sudah dikirim dengan No. Resi: ${noResi}`);
    }
  };

  return (
    <div>
      {/* Informasi Order */}
      <div className="mb-4 border p-4 rounded border-gray-200 shadow-sm bg-gray-50 text-sm">
        <p className="mb-2">
          <strong>Order ID: {order.orderId}</strong>
        </p>
        <p>
          <strong>Distributor:</strong> {order.distributor} |{' '}
          <strong>Agen ID:</strong> {order.agentId} |{' '}
          <strong>Status:</strong>{' '}
          <span
            className={`text-white text-xs px-2 py-1 rounded ${
              statusProduksi === 'Dikirim'
                ? 'bg-btn-info'
                : statusProduksi === 'Selesai Produksi'
                ? 'bg-btn-success'
                : 'bg-btn-primary'
            }`}
          >
            {statusProduksi}
          </span>
        </p>
      </div>

      {/* Tabel Produk */}
      <div className="rounded-xl border border-gray-200 shadow overflow-hidden">
        <table className="min-w-full text-sm text-center border">
          <thead className="bg-primary-dark text-white">
            <tr className="border-b border-gray-300">
              <th className="px-4 py-2">Nama Produk</th>
              <th className="px-4 py-2">Jumlah Produk</th>
              <th className="px-4 py-2">Status Produksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 hover:bg-gray-50"
              >
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {statusProduksi === 'Dikirim' || statusProduksi === 'Selesai Produksi'
                    ? 'Selesai'
                    : 'Menunggu Produksi'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section Resi & Button */}
      {statusProduksi !== 'Dikirim' && (
        <div className="flex flex-col gap-4 mt-6">
          {/* No Resi hanya muncul saat Selesai Produksi */}
          {statusProduksi === 'Selesai Produksi' && (
            <div className="flex flex-col w-1/3 gap-1">
              <label className="text-sm font-medium">No. Resi:</label>
              <input
                type="text"
                placeholder="Masukkan Nomor Resi"
                value={noResi}
                onChange={(e) => setNoResi(e.target.value)}
                className="border px-3 py-2 rounded text-sm border-gray-400"
              />
            </div>
          )}

          <div className="flex gap-2">
            {/* Tombol Selesai */}
            <button
              onClick={handleSelesaiProduksi}
              disabled={statusProduksi !== 'Sedang Diproduksi'}
              className={`px-4 py-2 rounded text-white ${
                statusProduksi !== 'Sedang Diproduksi'
                  ? 'bg-btn-disabled cursor-not-allowed'
                  : 'bg-btn-success hover:bg-green-700'
              }`}
            >
              Selesai
            </button>

            {/* Tombol Kirim */}
            <button
              onClick={handleKirim}
              disabled={statusProduksi !== 'Selesai Produksi'}
              className={`px-4 py-2 rounded text-white ${
                statusProduksi === 'Selesai Produksi'
                  ? 'bg-btn-info hover:bg-blue-700'
                  : 'bg-btn-disabled cursor-not-allowed'
              }`}
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabelDetailSedangDiproduksi;
