import React, { useState } from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeader from '../../Components/ComponentsDashboard/Common/PageHeader';
import SearchInput from '../../Components/ComponentsDashboard/Common/SearchInput';
import AgenTable from '../../Components/ComponentsDashboard/Distributor/Monitoring/AgenTable';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import iconMonitoring from '../../assets/IconHeader/MonitoringIcon.png';

const MonitoringAgen = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { handleNavigation } = useNavigation(distributorMenuItems);

    const [agenList, setAgenList] = useState([
        {
            id: 1,
            name: 'Atika Aji',
            email: 'maju@gmail.com',
            rekening: '12345678765',
            namaRekening: 'Atika Aji',
            namaBank: 'BCA',
            alamat: 'Jl. Melati no.20 Jakarta',
            terakhirOrder: '10/01/2024',
            aktif: true
        },
        {
            id: 2,
            name: 'Atika Aji',
            email: 'maju@gmail.com',
            rekening: '12345678765',
            namaRekening: 'Atika Aji',
            namaBank: 'BCA',
            alamat: 'Jl. Melati no.20 Jakarta',
            terakhirOrder: '10/01/2024',
            aktif: false
        }
    ]);

    const toggleAktif = (id) => {
        setAgenList(prev =>
            prev.map(agen =>
                agen.id === id ? { ...agen, aktif: !agen.aktif } : agen
            )
        );
    };

    const filteredAgenList = agenList.filter(agen =>
        agen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agen.alamat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AgenLayout
            menuItems={distributorMenuItems}
            activeLabel="Monitoring Agen"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
        >
            <PageHeader icon={iconMonitoring} title="Monitoring Agen" />

            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <div className="mb-4">
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari Agen berdasarkan nama, email, atau alamat"
                    />
                </div>

                <AgenTable agenList={filteredAgenList} toggleAktif={toggleAktif} />
            </div>
        </AgenLayout>
    );
};

export default MonitoringAgen;
