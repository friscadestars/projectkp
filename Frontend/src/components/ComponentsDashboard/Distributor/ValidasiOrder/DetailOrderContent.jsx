// src/Components/ComponentsDashboard/Distributor/ValidasiOrder/ValidasiOrderContent.jsx
import React from 'react';
import PageTitle from '../../Common/PageHeader';
import DetailOrderSection from './DetailOrderSection';
import ValidasiActions from '../../Common/ValidasiActions';

const DetailOrderContent = ({
    order,
    inputPrices,
    handleSetHarga,
    handleKirim,
    handleTolak,
    pageTitleProps
}) => {
    return (
        <>
            <PageTitle {...pageTitleProps} />
            <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6">
                <DetailOrderSection
                    order={order}
                    inputPrices={inputPrices}
                    handleSetHarga={handleSetHarga}
                />
                <ValidasiActions
                    orderId={order?.orderId}
                    onKirim={handleKirim}
                    handleTolak={handleTolak}
                />
            </div>
        </>
    );
};

export default DetailOrderContent;
