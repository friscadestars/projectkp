// src/Components/ComponentsDashboard/Distributor/KirimOrder/KirimOrderKePabrikContent.jsx
import React from 'react';
import PageHeader from '../../Common/PageHeader';
import SearchInput from '../../Common/SearchInput';
import OrderTable from './DistributorKirimOrderTable';

const KirimOrderKePabrikContent = ({
    searchTerm,
    setSearchTerm,
    approvedOrders,
    pageTitleProps
}) => {
    return (
        <>
            <PageHeader {...pageTitleProps} />

            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari Order ID / Agen / Distributor"
                    className="mb-4"
                />

                <OrderTable
                    orders={approvedOrders}
                    statusColor="green"
                    detailPath="/distributor/detail-kirim"
                    emptyMessage="Tidak ada order yang disetujui."
                />
            </div>
        </>
    );
};

export default KirimOrderKePabrikContent;
