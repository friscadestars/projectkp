import React, { useState } from 'react';
import Swal from 'sweetalert2';
import ReusableTable from '../../Common/ReusableTable';
import { useOrder } from '../../../../Context/OrderContext';
import { updateOrderStatus } from '../../../../services/ordersApi';

const TabelDetailSedangDiproduksi = ({ order }) => {
  const { products = [] } = order;

  // Context biar halaman utama ikut update
  const { updateOrderStatusInContext } = useOrder();

  const [statusProduksi, setStatusProduksi] = useState(order.statusProduksiText);
  const [noResi, setNoResi] = useState('');

  const showConfirmation = async (title, text, confirmButtonText) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
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
      try {
        // 1️⃣ Ubah status lokal di detail
        setStatusProduksi('Selesai Produksi');

        // 2️⃣ Update context → backend status "shipped", tapi UI override
        updateOrderStatusInContext(order.orderId, 'shipped', {
          statusPengiriman: 'Belum Dikirim',
          statusProduksiText: 'Selesai Produksi',
          overrideForUI: true // tanda kalau ini harus override tampilan di tabel
        });

        // 3️⃣ Simpan ke backend
        await updateOrderStatus(order.id, 'shipped');

        showSuccess('Berhasil!', 'Produksi telah diselesaikan.');
      } catch (err) {
        console.error('Gagal update status', err);
        Swal.fire('Error', 'Gagal menyimpan status ke server.', 'error');
      }
    }
  };

  // const handleKirim = async () => {
  //   if (!noResi) {
  //     Swal.fire({
  //       title: 'Nomor Resi Kosong',
  //       text: 'Silakan masukkan nomor resi sebelum mengirim.',
  //       icon: 'error',
  //       confirmButtonColor: '#3085d6',
  //     });
  //     return;
  //   }

  //   const confirmed = await showConfirmation(
  //     'Konfirmasi Kirim Order',
  //     `Apakah Anda yakin ingin mengirim order ${order.orderId} dengan No. Resi ${noResi}?`,
  //     'Ya, Kirim'
  //   );

  //   if (confirmed) {
  //     try {
  //       // Produksi tetap "Selesai Produksi"
  //       setStatusProduksi('Selesai Produksi');

  //       // Update context: produksi = selesai, pengiriman = dikirim
  //       updateOrderStatusInContext(order.orderId, 'shipped');

  //       // Simpan ke backend → status = shipped
  //       await updateOrderStatus(order.id, 'shipped');

  //       showSuccess(
  //         'Berhasil!',
  //         `Order ${order.orderId} sudah dikirim dengan No. Resi: ${noResi}`
  //       );
  //     } catch (err) {
  //       console.error('Gagal kirim order', err);
  //       Swal.fire('Error', 'Gagal menyimpan status ke server.', 'error');
  //     }
  //   }
  // };

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
    try {
      // ✅ Ubah status lokal jadi "Dikirim"
      setStatusProduksi('Dikirim');

      // ✅ Update context → backend status "shipped"
      updateOrderStatusInContext(order.orderId, 'shipped');

      // ✅ Simpan ke backend
      await updateOrderStatus(order.id, 'shipped');

      showSuccess(
        'Berhasil!',
        `Order ${order.orderId} sudah dikirim dengan No. Resi: ${noResi}`
      );
    } catch (err) {
      console.error('Gagal kirim order', err);
      Swal.fire('Error', 'Gagal menyimpan status ke server.', 'error');
    }
  }
};


  const columns = [
    { key: 'product_name', label: 'Nama Produk' },
    { key: 'quantity', label: 'Jumlah Produk' },
    {
      key: 'statusProduksi',
      label: 'Status Produksi',
      render: () =>
        statusProduksi === 'Dikirim' || statusProduksi === 'Selesai Produksi'
          ? 'Selesai'
          : 'Menunggu Produksi',
    },
  ];

  return (
    <div>
      {/* Info Order */}
      <div className="mb-4 border p-4 rounded border-gray-200 shadow-sm bg-gray-50 text-sm">
        <p className="mb-2">
          <strong>Order ID: {order.orderId}</strong>
        </p>
        <p>
          <strong>Distributor:</strong> {order.distributor} |{' '}
          <strong>Agen:</strong> {order.agentName} |{' '}
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
      <div className="border border-gray-200 shadow overflow-hidden">
        <ReusableTable columns={columns} data={products} />
      </div>

      {/* Resi & Button */}
      {statusProduksi !== 'Dikirim' && (
        <div className="flex flex-col gap-4 mt-6">
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
            <button
              onClick={handleSelesaiProduksi}
              disabled={statusProduksi !== 'Sedang Diproduksi'}
              className={`px-4 py-2 rounded text-white ${
                statusProduksi !== 'Sedang Diproduksi'
                  ? 'bg-btn-disabled cursor-not-allowed'
                  : 'bg-btn-dark hover:bg-gray-800'
              }`}
            >
              Selesai
            </button>

            <button
              onClick={handleKirim}
              disabled={statusProduksi !== 'Selesai Produksi'}
              className={`px-4 py-2 rounded text-white ${
                statusProduksi === 'Selesai Produksi'
                  ? 'bg-btn-dark hover:bg-gray-800'
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
