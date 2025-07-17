// src/Components/Constants/menuItems.js

import dashboardIcon from '../../../assets/IconSidebar/Dashboard.png';
import ringkasanIcon from '../../../assets/IconSidebar/RingkasanOrder.png';
import permintaanIcon from '../../../assets/IconSidebar/PermintaanOrder.png';
import riwayatIcon from '../../../assets/IconSidebar/RiwayatOrder.png';
import tagihanIcon from '../../../assets/IconSidebar/Tagihan.png';
import logoutIcon from '../../../assets/IconSidebar/Logout.png';
import monitoringIcon from '../../../assets/IconSidebar/Monitoring.png';
import validasiIcon from '../../../assets/IconSidebar/ValidasiOrder.png';
import daftarHargaIcon from '../../../assets/IconSidebar/DaftarHarga.png';
import dashboardPabrikIcon from '../../../assets/IconSidebar/pabrik_dasboard.png';
import daftarOrderMasukIcon from '../../../assets/IconSidebar/pabrik_daftar_order.png';
import produksiIcon from '../../../assets/IconSidebar/pabrik_produksi_pengiriman.png';

// Menu khusus Agen
export const agenMenuItems = [
    { label: 'Dashboard', icon: dashboardIcon, path: '/agen/dashboard-agen' },
    { label: 'Ringkasan Order', icon: ringkasanIcon, path: '/agen/ringkasan-order' },
    { label: 'Permintaan Order', icon: permintaanIcon, path: '/agen/permintaan-order' },
    { label: 'Riwayat Order', icon: riwayatIcon, path: '/agen/riwayat-order' },
    { label: 'Tagihan', icon: tagihanIcon, path: '/agen/tagihan' },
    { label: 'Logout', icon: logoutIcon, path: '/' },
];

// Menu khusus Distributor
export const distributorMenuItems = [
    { label: 'Dashboard', icon: dashboardIcon, path: '/distributor/dashboard-distributor' },

    {
        label: 'Validasi Order', icon: validasiIcon, subItems: [
            { label: 'Validasi Order', path: '/distributor/validasi-order' },
            { label: 'Kirim Order ke Pabrik', path: '/distributor/kirim-order' }
        ]
    },

    {
        label: 'Monitoring', icon: monitoringIcon, subItems: [
            { label: 'Monitoring Order', path: '/distributor/monitoring-order' },
            { label: 'Monitoring Agen', path: '/distributor/monitoring-agen' }
        ]
    },

    {
        label: 'Daftar Harga', icon: daftarHargaIcon, subItems: [
            { label: 'Daftar Harga Pabrik', path: '/distributor/daftar-harga-pabrik' },
            { label: 'Daftar Harga Distributor', path: '/distributor/daftar-harga-distributor' }
        ]
    },

    { label: 'Riwayat Order', icon: riwayatIcon, path: '/distributor/riwayat-order' },
    { label: 'Tagihan', icon: tagihanIcon, path: '/distributor/tagihan' },
    { label: 'Logout', icon: logoutIcon, path: '/' },
];

// Menu khusus Pabrik
export const pabrikMenuItems = [
    { label: 'Dashboard', icon: dashboardPabrikIcon, path: '/pabrik/dashboard-pabrik' },
    { label: 'Daftar Order Masuk', icon: daftarOrderMasukIcon, path: '/pabrik/daftar-order-masuk' },
    { label: 'Produksi & Pengiriman', icon: produksiIcon, path: '/pabrik/produksi-pengiriman' },
    { label: 'Monitoring Distributor', icon: monitoringIcon, path: '/pabrik/monitoring-distributor' },
    { label: 'Daftar Harga', icon: daftarHargaIcon, path: '/pabrik/daftar-harga' },
    { label: 'Riwayat Pengiriman', icon: riwayatIcon, path: '/pabrik/riwayat-pengiriman' },
    { label: 'Logout', icon: logoutIcon, path: '/' },
];
