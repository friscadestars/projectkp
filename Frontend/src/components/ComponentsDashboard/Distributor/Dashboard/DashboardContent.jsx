// src/Components/Distributor/Dashboard/DashboardContent.jsx

import React from 'react';
import DashboardSummary from '../../Card/DashboardSummary'; // gunakan yang sudah kamu tunjukkan tadi
import ShippingStatusTable from '../../Agen/Table/ShippingStatusTable';

const DashboardContent = ({ summaryCards, sortedOrders }) => (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
        <DashboardSummary cards={summaryCards} />
        <h2 className="text-lg font-semibold mb-4 mt-6">Status Pengiriman Terbaru</h2>
        <ShippingStatusTable orders={sortedOrders} />
    </div>
);

export default DashboardContent;
