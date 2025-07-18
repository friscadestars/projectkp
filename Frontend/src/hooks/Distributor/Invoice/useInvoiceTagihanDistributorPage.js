// src/hooks/Distributor/Invoice/useInvoiceTagihanDistributorPage.js
import { useNavigation } from '../../../hooks/useNavigation';
import { distributorMenuItems } from '../../../Components/ComponentsDashboard/Constants/menuItems';
import useInvoiceData from './useInvoiceData';
import invoiceIcon from '../../../assets/IconHeader/IconTagihan.png';

export const useInvoiceTagihanDistributorPage = () => {
    const {
        invoiceData,
        statusPembayaran,
        showModal,
        openModal,
        closeModal,
        handleKonfirmasi
    } = useInvoiceData('/distributor/invoice');

    const { handleNavigation } = useNavigation(distributorMenuItems);

   return {
    invoiceData,
    statusPembayaran,
    showModal,
    openModal,
    closeModal,
    handleKonfirmasi,
    layoutProps: {
        menuItems: distributorMenuItems,
        activeLabel: 'Tagihan',
        onNavigate: handleNavigation
    },
    pageTitleProps: {
        icon: invoiceIcon,
        title: 'Invoice Tagihan'
    },
    invoiceProps: {
        order: invoiceData,
        statusPembayaran,
        showModal,
        openModal,
        closeModal,
        handleKonfirmasi,
        showConfirmButton: statusPembayaran !== 'Lunas', // ✅ logika tombol tampil
    }
};

};
