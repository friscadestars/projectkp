import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../../Context/OrderContext';

const SubmitButton = ({ onClick, orderId }) => {
  const navigate = useNavigate();
  const { markAsProcessed } = useOrder();

  const showConfirmation = async () => {
    const result = await Swal.fire({
      title: 'Konfirmasi Kirim Order',
      text: 'Apakah Anda yakin ingin mengirim order ini ke distributor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed && typeof onClick === 'function') {
      const res = await onClick();

      if (res?.success) {
        markAsProcessed(orderId);

        await Swal.fire({
          title: 'Order Dikirim',
          text: 'Order berhasil dikirim ke distributor.',
          icon: 'success',
          confirmButtonColor: '#2563eb',
        });

        navigate('/agen/permintaan-order');
      } else {
        await Swal.fire({
          title: 'Gagal Mengirim',
          text: res?.message || 'Terjadi kesalahan.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <div className="mt-6">
      <button
        className="bg-blue-900 hover:bg-blue-900 text-white px-6 py-2 rounded font-bold"
        onClick={showConfirmation}
      >
        Kirim
      </button>
    </div>
  );
};

export default SubmitButton;
