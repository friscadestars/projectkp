// src/utils/InfoDetailOrder.js

import truckIcon from '../../assets/IconHeader/IconTruck.png';
import iconRiwayat from '../../assets/IconHeader/IconRiwayat.png';
// Tambahkan icon lainnya sesuai kebutuhan

const ORDER_PAGE_CONFIG = {
    ringkasan: {
        titleText: 'Ringkasan Order',
        icon: truckIcon,
        activeLabel: 'Ringkasan Order',
    },
    riwayat: {
        titleText: 'Detail Riwayat Order',
        icon: iconRiwayat,
        activeLabel: 'Riwayat Order',
    },
    // Contoh tambahan jika diperlukan:
    // edit: {
    //     titleText: 'Edit Order',
    //     icon: editIcon,
    //     activeLabel: 'Edit Order',
    // },
};

export const getOrderPageInfo = (from = 'ringkasan') => {
    return ORDER_PAGE_CONFIG[from] || ORDER_PAGE_CONFIG['ringkasan'];
};
