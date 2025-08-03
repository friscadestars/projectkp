import { useEffect, useState } from 'react';
import { agenMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../useNavigation';

const useTagihanPage = (agenId) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { handleNavigation } = useNavigation(agenMenuItems);

    useEffect(() => {
        if (!agenId) return;

        const fetchInvoices = async () => {
            try {
                const res = await fetch(`/api/invoices/getByAgent/${agenId}`);
                if (!res.ok) throw new Error('Gagal memuat data tagihan');
                const data = await res.json();
                setInvoices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [agenId]);

    return {
        showDropdown,
        toggleDropdown: () => setShowDropdown(prev => !prev),
        searchTerm,
        setSearchTerm,
        handleNavigation,
        invoices,
        loading,
        error
    };
};

export default useTagihanPage;
