import { useEffect, useState } from 'react';

export const useMonitoringDistributor = () => {
  const [distributors, setDistributors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:8080/api/users?role=distributor', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Gagal fetch data distributor');
        }

        const data = await response.json();

        // Mapping data dari backend ke format frontend
        const distributorList = data.map(user => ({
          distributorId: user.id,
          distributor: user.name,
          email: user.email,
          noRek: user.rekening || '-',
          address: user.alamat || '-',
          lastOrder: user.created_at?.slice(0, 10) || '-',
          isActive: user.is_active === 1,
        }));

        setDistributors(distributorList);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistributors();
  }, []);

  const filteredOrders = distributors.filter((d) =>
    d.distributor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredOrders,
    loading
  };
};
