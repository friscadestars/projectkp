import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout.jsx';
import { pabrikMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems.js';
import { useDaftarOrderMasuk } from '../../hooks/Pabrik/DaftarOrder/useDaftarOrderMasuk.js';
import { useNavigation } from '../../hooks/useNavigation.js';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader.jsx';
import TableDaftarOrderMasuk from '../../components/ComponentsDashboard/Pabrik/DetailOrderMasuk/TableDaftarOrderMasuk.jsx';
import IconOrderMasuk from '../../assets/IconHeader/IconOrderMasuk.png';
import SearchInput from '../../components/ComponentsDashboard/Common/SearchInput.jsx';

const DaftarOrderMasuk = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { daftarOrders, searchOrders, search, handleDetail } = useDaftarOrderMasuk();
    const { handleNavigation } = useNavigation(pabrikMenuItems);

    return (
        <Layout
            menuItems={pabrikMenuItems}
            activeLabel="Daftar Order Masuk"
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
            onNavigate={handleNavigation}
        >
            <PageHeader
                icon={IconOrderMasuk}
                title="Daftar Order Masuk Dari Distributor"
            />

            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                {/* Search Bar */}
                <SearchInput
                    value={search}
                    onChange={(e) => searchOrders(e.target.value)}
                />

                {/* Table */}
                <TableDaftarOrderMasuk orders={daftarOrders} onDetail={handleDetail} />
            </div>
        </Layout>
    );
};

export default DaftarOrderMasuk;
