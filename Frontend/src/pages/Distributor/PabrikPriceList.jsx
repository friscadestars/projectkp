import React from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeader from '../../Components/ComponentsDashboard/Common/PageHeader';
import PriceListSection from '../../Components/ComponentsDashboard/Distributor/PriceList/PriceListSection';
import iconHarga from '../../assets/IconHeader/HargaIcon.png';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';
import { usePabrikPriceListPage } from '../../hooks/Distributor/PriceList/usePabrikPriceListPage';

const PabrikPriceList = () => {
    const { handleNavigation } = useNavigation(distributorMenuItems);
    const priceListProps = usePabrikPriceListPage();

    return (
        <AgenLayout
            menuItems={distributorMenuItems}
            activeLabel="Daftar Harga Pabrik"
            onNavigate={handleNavigation}
        >
            <PageHeader icon={iconHarga} title="Daftar Harga Pabrik" />
            <PriceListSection {...priceListProps} />
        </AgenLayout>
    );
};

export default PabrikPriceList;
