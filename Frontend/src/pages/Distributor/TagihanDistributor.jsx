import React, { useState, useEffect } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import TagihanDistributorContent from '../../components/ComponentsDashboard/Distributor/Tagihan/TagihanDistributorContent';
import { useTagihanDistributorPage } from '../../hooks/Distributor/Tagihan/useTagihanDistributorPage';

const TagihanDistributor = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { handleNavigation } = useNavigation(distributorMenuItems);

    const [distributorId, setDistributorId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log("User dari localStorage:", user);
        if (user?.id && user?.role === 'distributor') {
            setDistributorId(user.id);
        }
    }, []);

    const tagihanProps = useTagihanDistributorPage();

    if (!distributorId) {
        return <div>Memuat ID distributor...</div>;
    }

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
