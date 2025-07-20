import iconTagihan from '../../../assets/IconHeader/IconTagihan.png';
import { useNavigation } from '../../useNavigation';
import { agenMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import useInvoiceTagihan from './useInvoiceTagihan';

export const useInvoiceTagihanPage = () => {
    const {
        invoiceData,
        statusPembayaran,
        showDropdown,
        toggleDropdown,
        handleConfirmPayment,
        showModal,
        openModal,
        closeModal
    } = useInvoiceTagihan();

    const { handleNavigation } = useNavigation(agenMenuItems);

    const layoutProps = {
        menuItems: agenMenuItems,
        activeLabel: 'Tagihan',
        onNavigate: handleNavigation,
        showDropdown,
        toggleDropdown
    };

    const pageTitleProps = {
        icon: iconTagihan,
        title: 'Invoice Tagihan'
    };

    const invoiceProps = {
        invoiceData,
        statusPembayaran,
        onConfirmPayment: handleConfirmPayment,
        onOpenModal: openModal,
        onCloseModal: closeModal,
        showModal,
        showAgen: false,
        showDistributor: true,
        showConfirmationButton: true
    };

    return {
        layoutProps,
        pageTitleProps,
        invoiceProps,
        isLoading: !invoiceData
    };
};