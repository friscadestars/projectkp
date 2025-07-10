import { useState } from 'react';

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

    const handleDelete = (orderId) => {
        const confirmDelete = window.confirm('Yakin ingin menghapus order ini?');
        if (confirmDelete) {
            setOrders(prev => prev.filter(order => order.id !== orderId));
        }
    };

    return { orders, handleDelete };
};
