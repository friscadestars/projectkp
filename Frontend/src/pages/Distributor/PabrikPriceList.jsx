import React from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader';
import PriceListSection from '../../Components/ComponentsDashboard/Distributor/PriceList/PriceListSection';
import iconHarga from '../../assets/IconHeader/HargaIcon.png';
import { distributorMenuItems } from '../../components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import { usePabrikPriceListPage } from '../../hooks/Distributor/PriceList/usePabrikPriceListPage';

const PabrikPriceList = () => {
    const { handleNavigation } = useNavigation(distributorMenuItems);
    const priceListProps = usePabrikPriceListPage();

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Daftar Harga Pabrik"
            onNavigate={handleNavigation}
            role="distributor" 
        >
            <PageHeader icon={iconHarga} title="Daftar Harga Pabrik" />
            <PriceListSection {...priceListProps} />
        </Layout>
    );
};

export default PabrikPriceList;
