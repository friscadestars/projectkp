// src/pages/Distributor/PabrikPriceList.jsx
import React from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeader from '../../components/ComponentsDashboard/Common/PageHeader';
import PriceListSection from '../../Components/ComponentsDashboard/Distributor/PriceList/PriceListSection';
import { usePabrikPriceListForDistributorPage } from '../../hooks/Distributor/PriceList/usePabrikPriceListForDistributorPage';

const PabrikPriceList = () => {
    const {
        layoutProps,
        pageTitleProps,
        loading,
        ...restProps
    } = usePabrikPriceListForDistributorPage();

    return (
        <Layout {...layoutProps} role="distributor">
            <PageHeader {...pageTitleProps} />
            <PriceListSection
                {...restProps}
                hargaLabel="Harga Pabrik"
                hargaHeader="Harga Pabrik"
                canEdit={false}
                loading={loading}
            />
        </Layout>
    );
};

export default PabrikPriceList;
