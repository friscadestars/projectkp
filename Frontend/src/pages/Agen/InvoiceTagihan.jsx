import React from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import HeaderSection from '../../Components/ComponentsDashboard/Common/PageHeader';
import InvoiceLayout from '../../Components/ComponentsDashboard/Invoice/InvoiceLayout';
import useInvoiceTagihan from '../../hooks/Agen/useInvoiceTagihan';
import iconTagihan from '../../assets/IconHeader/IconTagihan.png';
import { agenMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useNavigation } from '../../hooks/useNavigation';

const InvoiceTagihan = () => {
    const {
        invoiceData,
        statusPembayaran,
        showModal,
        showDropdown,
        toggleDropdown,
        setShowModal,
        handleConfirmPayment,
    } = useInvoiceTagihan();

    const { handleNavigation } = useNavigation(agenMenuItems);
    if (!invoiceData) {
        return (
            <div className="flex justify-center items-center min-h-screen text-blue-900 text-xl">
                Memuat invoice...
            </div>
        );
    }

    return (
        <AgenLayout
            menuItems={agenMenuItems}
            activeLabel="Tagihan"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
        >
            <HeaderSection icon={iconTagihan} title="Invoice Tagihan" />

            <InvoiceLayout
                invoiceData={invoiceData}
                statusPembayaran={statusPembayaran}
                showModal={showModal}
                onOpenModal={() => setShowModal(true)}
                onCloseModal={() => setShowModal(false)}
                onConfirmPayment={handleConfirmPayment}
                showAgen={false}
                showDistributor={true}
                showConfirmationButton={true}
            />
        </AgenLayout>
    );
};

export default InvoiceTagihan;
