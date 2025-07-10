import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import TagihanTable from '../../Components/ComponentsDashboard/Agen/Table/TagihanTable';
import tagihanIcon from '../../assets/IconHeader/IconTagihan.png';
import PageHeaderWithIcon from '../../Components/ComponentsDashboard/Common/PageHeader';
import SearchInput from '../../Components/ComponentsDashboard/Common/SearchInput';
import { useNavigation } from '../../hooks/useNavigation';

const TagihanDistributor = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { handleNavigation } = useNavigation(distributorMenuItems);

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
            statusPembayaran: 'Lunas',
        },
    ];

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Tagihan"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
        >
            <PageHeaderWithIcon icon={tagihanIcon} title="Tagihan Anda" />

            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <div className="mb-4">
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari Order ID atau Agen ID"
                    />
                </div>

                <TagihanTable
                    orders={orders}
                    searchTerm={searchTerm}
                    role="distributor"
                />
            </div>
        </Layout>
    );
};

export default TagihanDistributor;
