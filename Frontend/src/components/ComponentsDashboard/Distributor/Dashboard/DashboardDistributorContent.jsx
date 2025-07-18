// src/Components/ComponentsDashboard/Distributor/Dashboard/DashboardDistributorContent.jsx
import React from 'react';
import DashboardWelcomeHeader from '../../Common/PageHeader';
import IconWelcome from '../../../../assets/IconHeader/IconWelcome.png';
import ShippingStatusTable from './TablePesananTerbaru';
import DashboardSummary from '../../Card/DashboardSummary';
import { useDashboardData } from "../../../../hooks/Distributor/Dashboard/useDashboardData";

const DashboardContent = ({ summaryCards, sortedOrders }) => (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
        <DashboardSummary cards={summaryCards} />
        <h2 className="text-lg font-semibold mb-4 mt-6">Status Pengiriman Terbaru</h2>
        <ShippingStatusTable orders={sortedOrders} />
    </div>
);

const DashboardDistributorContent = () => {
    const { summaryCards, sortedOrders } = useDashboardData();

    return (
        <>
            <DashboardWelcomeHeader icon={IconWelcome} title="Selamat Datang Di Dashboard Anda" />
            <DashboardContent summaryCards={summaryCards} sortedOrders={sortedOrders} />
        </>
    );
};

export default DashboardDistributorContent;
