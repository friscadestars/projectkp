import React from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import { usePabrikPriceListPage } from '../../hooks/Pabrik/PriceList/usePabrikPriceListPage';
import PriceListSection from '../../components/ComponentsDashboard/Pabrik/6_DaftarHarga/PriceListSection';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader'; 
import { pabrikMenuItems } from "../../Components/ComponentsDashboard/Constants/menuItems";
import { useNavigation } from '../../hooks/useNavigation';
import iconDaftarHarga from "../../assets/IconHeader/HargaIcon.png";

const DaftarHarga = () => {
    const {  pageTitleProps, ...restProps } = usePabrikPriceListPage();
    const { handleNavigation } = useNavigation(pabrikMenuItems);

    return (
        <Layout
          menuItems={pabrikMenuItems}
          activeLabel="Daftar Harga"
          onNavigate={handleNavigation}
        >
            <PageHeader {...pageTitleProps}   
            icon={iconDaftarHarga}
            title="Daftar Harga Produk"/>
            <PriceListSection {...restProps}
                canEdit={true} />
        </Layout>
    );
};

export default DaftarHarga;


