import React, { useState } from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import InvoiceLayout from '../../Components/ComponentsDashboard/Invoice/InvoiceLayout';
import PageHeader from '../../Components/ComponentsDashboard/Common/PageHeader';
import invoiceIcon from '../../assets/IconHeader/IconTagihan.png';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import useInvoiceData from '../../hooks/Distributor/useInvoiceData';
import { useNavigation } from '../../hooks/useNavigation';

const InvoiceTagihanDistributor = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const {
        invoiceData,
        statusPembayaran,
        showModal,
        openModal,
        closeModal,
        handleKonfirmasi,
    } = useInvoiceData('/distributor/invoice');

    const { handleNavigation } = useNavigation(distributorMenuItems);

    if (!invoiceData) {
        return (
            <div className="flex justify-center items-center min-h-screen text-blue-900 text-xl">
                Memuat invoice...
            </div>
        );
    }

    return (
        <AgenLayout
            menuItems={distributorMenuItems}
            activeLabel="Tagihan"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(prev => !prev)}
        >
            <PageHeader icon={invoiceIcon} title="Invoice Tagihan" />

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
        </AgenLayout>
    );
};

export default InvoiceTagihanDistributor;
