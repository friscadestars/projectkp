import { useState } from 'react';

export const useTagihanDistributorPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const orders = [
        {
            orderId: 'ORD-001',
            agenId: 'AG-001',
            pabrikId: 'PB-001',
            orderDate: '24/06/2025',
            deliveryEstimate: '26/06/2025',
            status: 'Diterima',
            statusPembayaran: 'Belum Lunas',
        },
        {
            orderId: 'ORD-002',
            agenId: 'AG-001',
            pabrikId: 'PB-001',
            orderDate: '24/06/2025',
            deliveryEstimate: '26/06/2025',
            status: 'Dikirim',
            statusPembayaran: 'Belum Lunas',
        },
    ];

    return { searchTerm, setSearchTerm, orders };
};
