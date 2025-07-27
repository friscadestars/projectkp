// src/hooks/Distributor/PriceList/useDistributorPriceListPage.js
import iconHarga from '../../../assets/IconHeader/HargaIcon.png';
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import { useDistributorPriceList } from './useDistributorPriceList';

export const useDistributorPriceListPage = () => {
    const {
        form, setForm,
        searchTerm, setSearchTerm,
        filteredProduk,
        handleAdd, handleEdit, handleSave, handleDelete
    } = useDistributorPriceList();

    const { handleNavigation } = useNavigation(distributorMenuItems);

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
            menuItems: distributorMenuItems,
            activeLabel: "Daftar Harga Distributor",
            onNavigate: handleNavigation
        },
        pageTitleProps: {
            icon: iconHarga,
            title: "Daftar Harga Distributor"
        }
    };
};
