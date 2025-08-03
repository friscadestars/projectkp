import { useEffect, useState } from 'react';
import { agenMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';
import iconTagihan from '../../../assets/IconHeader/IconTagihan.png';
import { useNavigation } from '../../useNavigation';
import { fetchInvoicesForAgent, fetchOrderById } from '/src/services/ordersApi.js';

export const useTagihanPageProps = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const { handleNavigation } = useNavigation(agenMenuItems);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const invoices = await fetchInvoicesForAgent();
                console.log("📦 Invoices:", invoices);

                const enrichedInvoices = await Promise.all(
                    invoices.map(async (inv) => {
                        let order = {};
                        try {
                            if (inv.order_id) {
                                order = await fetchOrderById(inv.order_id);
                            }
                        } catch (e) {
                            console.warn('Gagal ambil order untuk invoice:', inv.id, e.message);
                            // Tidak hentikan proses, tetap kembalikan invoice
                        }

                        return {
                            ...order,
                            tagihan: inv,
                            statusPembayaran: inv.status || 'Belum Lunas'
                        };
                    })
                );

                if (mounted) setInvoices(enrichedInvoices);
            } catch (e) {
                console.error('Gagal fetch invoices:', e.message);
                if (mounted) setError('Gagal memuat tagihan');
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return {
        layoutProps: {
            menuItems: agenMenuItems,
            activeLabel: 'Tagihan',
            onNavigate: handleNavigation,
            showDropdown,
            toggleDropdown: () => setShowDropdown(prev => !prev),
        },
        pageHeaderProps: {
            icon: iconTagihan,
            title: 'Tagihan Anda'
        },
        searchInputProps: {
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder: 'Cari Order ID / Distributor / Status'
        },
        tagihanTableProps: {
            invoices,
            searchTerm,
            role: 'agen'
        },
        loading,
        error
    };
};
