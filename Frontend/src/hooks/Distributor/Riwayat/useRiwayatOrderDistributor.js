import { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2

export const useRiwayatOrderDistributor = () => {
    const [orders, setOrders] = useState([
        {
            id: 'ORD-002',
            agenId: 'AG-001',
            tanggalOrder: '24/06/2025',
            tanggalTerima: '26/06/2025',
            hargaPabrik: 'Rp 200.000',
            hargaJual: 'Rp 250.000',
            statusPembayaran: 'Belum Dibayar',
            statusOrder: 'Diterima',
        },
        {
            id: 'ORD-001',
            agenId: 'AG-001',
            tanggalOrder: '24/06/2025',
            tanggalTerima: '26/06/2025',
            hargaPabrik: 'Rp 200.000',
            hargaJual: 'Rp 250.000',
            statusPembayaran: 'Lunas',
            statusOrder: 'Diterima',
        },
    ]);

    const handleDelete = (id) => {
    Swal.fire({
        title: 'Yakin ingin menghapus?',
        text: 'Data yang sudah dihapus tidak dapat dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',  
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            onDelete(id);
            Swal.fire({
                title: 'Terhapus!',
                text: 'Riwayat order berhasil dihapus.',
                icon: 'success',
                confirmButtonColor: '#2563eb',
            });
        }
    });
};

    return { orders, handleDelete };
};
