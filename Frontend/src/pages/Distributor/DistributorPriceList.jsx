import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { useDistributorPriceListPage } from '../../hooks/Distributor/PriceList/useDistributorPriceListPage';
import PriceListSection from '../../Components/ComponentsDashboard/Distributor/PriceList/PriceListSection';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader'; // jika belum diimpor

const DistributorPriceList = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(prev => !prev);
    const { layoutProps, pageTitleProps, ...restProps } = useDistributorPriceListPage();

    return (
        <Layout
            {...layoutProps}
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
            role="distributor" 
        >
            <PageHeader {...pageTitleProps} />
            <PriceListSection {...restProps} />
        </Layout>
    );
};

export default DistributorPriceList;
