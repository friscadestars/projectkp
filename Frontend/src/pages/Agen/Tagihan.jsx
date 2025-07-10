import React from 'react';
import { useOrder } from '../../Context/OrderContext.jsx';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout.jsx';
import TagihanTable from '../../Components/ComponentsDashboard/Agen/Table/TagihanTable.jsx';
import PageHeaderWithIcon from '../../Components/ComponentsDashboard/Common/PageHeader.jsx';
import iconTagihan from '../../assets/IconHeader/IconTagihan.png';
import { agenMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems.js';
import useTagihanPage from '../../hooks/Agen/useTagihanPage.js';
import SearchInput from '../../Components/ComponentsDashboard/Common/SearchInput.jsx';

const Tagihan = () => {
    const { orders } = useOrder();
    const {
        showDropdown,
        toggleDropdown,
        searchTerm,
        setSearchTerm,
        handleNavigation
    } = useTagihanPage();

    return (
        <AgenLayout
            menuItems={agenMenuItems}
            activeLabel="Tagihan"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
        >
            <PageHeaderWithIcon icon={iconTagihan} title="Tagihan Anda" />

            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari Order ID"
                    />
                </div>

                <TagihanTable orders={orders} searchTerm={searchTerm} />
            </div>
        </AgenLayout>
    );
};

export default Tagihan;
