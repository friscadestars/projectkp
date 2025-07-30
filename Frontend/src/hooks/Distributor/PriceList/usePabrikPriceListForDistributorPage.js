// src/hooks/Distributor/PriceList/usePabrikPriceListForDistributorPage.js
import { usePriceListByRole } from './usePriceListByRole';
import iconHarga from '../../../assets/IconHeader/HargaIcon.png';
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';

export const usePabrikPriceListForDistributorPage = () => {
    const {
        form,
        setForm,
        searchTerm,
        setSearchTerm,
        filteredProduk,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete
    } = usePriceListByRole('pabrik'); // ✅ ambil data role: pabrik

    const { handleNavigation } = useNavigation(distributorMenuItems); // ✅ pakai menu distributor

    return {
        form,
        setForm,
        searchTerm,
        setSearchTerm,
        filteredProduk,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete,
        layoutProps: {
            menuItems: distributorMenuItems, // ✅ ini penting
            activeLabel: "Daftar Harga Pabrik",
            onNavigate: handleNavigation
        },
        pageTitleProps: {
            icon: iconHarga,
            title: "Daftar Harga Pabrik"
        }
    };
};
