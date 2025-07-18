import Swal from 'sweetalert2';

export const showConfirmation = async (title, text, confirmButtonText = 'Ya') => {
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
