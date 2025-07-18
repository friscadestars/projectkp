import React from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import HeaderSection from '../../components/ComponentsDashboard/Common/PageHeader';
import InvoiceLayout from '../../components/ComponentsDashboard/Invoice/InvoiceLayout';
import { useInvoiceTagihanPage } from '../../hooks/Agen/Invoice/useInvoiceTagihanPage';

const InvoiceTagihan = () => {
    const props = useInvoiceTagihanPage();

    if (props.isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-blue-900 text-xl">
                Memuat invoice...
            </div>
        );
    }

    return (
        <AgenLayout {...props.layoutProps}
        role="agen" 
        >
            <HeaderSection {...props.pageTitleProps} />
            <InvoiceLayout {...props.invoiceProps} />
        </AgenLayout>
    );
};

export default InvoiceTagihan;
