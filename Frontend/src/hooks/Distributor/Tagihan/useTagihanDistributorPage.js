import { useState, useEffect } from 'react';

export const useTagihanDistributorPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const distributorId = user?.id;

            if (!distributorId || user?.role !== 'distributor') {
                setLoading(false);
                setError("User tidak valid atau bukan distributor.");
                return;
            }

            try {
                const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
                const token = localStorage.getItem('token');

                const res = await fetch(`${BASE_URL}/invoices/getByDistributor/${distributorId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) throw new Error('Gagal memuat data invoice distributor');
                const data = await res.json();

                setOrders(data);
                console.log('Fetched Orders:', data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    return { searchTerm, setSearchTerm, orders, loading, error };
};
