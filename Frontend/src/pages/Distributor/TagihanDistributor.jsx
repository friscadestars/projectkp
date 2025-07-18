import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { distributorMenuItems } from '../../components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import TagihanDistributorContent from '../../components/ComponentsDashboard/Distributor/Tagihan/TagihanDistributorContent';
import { useTagihanDistributorPage } from '../../hooks/Distributor/Tagihan/useTagihanDistributorPage';

const TagihanDistributor = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(distributorMenuItems);
    const tagihanProps = useTagihanDistributorPage();
    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Tagihan"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
            role="distributor" 
        >
            <TagihanDistributorContent {...tagihanProps} />
        </Layout>
    );
};

export default TagihanDistributor;
