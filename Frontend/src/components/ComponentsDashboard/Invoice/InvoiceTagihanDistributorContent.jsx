// src/Components/ComponentsDashboard/Distributor/Invoice/InvoiceTagihanDistributorContent.jsx
import React from 'react';
import PageHeader from '../Common/PageHeader';
import InvoiceLayout from './InvoiceLayout';

const InvoiceTagihanDistributorContent = ({
    invoiceData,
    statusPembayaran,
    showModal,
    openModal,
    closeModal,
    handleKonfirmasi,
    pageTitleProps
}) => {
    return (
        <>
            <PageHeader {...pageTitleProps} />

            <InvoiceLayout
                invoiceData={invoiceData}
                statusPembayaran={statusPembayaran}
                showModal={showModal}
                onOpenModal={openModal}
                onCloseModal={closeModal}
                onConfirmPayment={handleKonfirmasi}
                showAgen={true}
                showDistributor={true}
                showConfirmationButton={true}
            />
        </>
    );
};

export default InvoiceTagihanDistributorContent;
