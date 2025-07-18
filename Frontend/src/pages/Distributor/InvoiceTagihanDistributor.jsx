import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import InvoiceTagihanDistributorContent from '../../components/ComponentsDashboard/Invoice/InvoiceTagihanDistributorContent';
import { useInvoiceTagihanDistributorPage } from '../../hooks/Distributor/Invoice/useInvoiceTagihanDistributorPage';

const InvoiceTagihanDistributor = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(prev => !prev);

    const props = useInvoiceTagihanDistributorPage();

    if (!props.invoiceData) {
        return (
            <div className="flex justify-center items-center min-h-screen text-blue-900 text-xl">
                Memuat invoice...
            </div>
        );
    }

    return (
        <Layout
            {...props.layoutProps}
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
            role="distributor" 
        >
            <InvoiceTagihanDistributorContent {...props} />
        </Layout>
    );
};

export default InvoiceTagihanDistributor;
