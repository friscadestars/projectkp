// src/hooks/Distributor/PriceList/useDistributorPriceListPage.js
import { usePriceListByRole } from './usePriceListByRole'; // path disesuaikan
import iconHarga from '../../../assets/IconHeader/HargaIcon.png';
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';

export const useDistributorPriceListPage = () => {
    const {
        form, setForm,
        searchTerm, setSearchTerm,
        filteredProduk,
        handleAdd, handleEdit, handleSave, handleDelete
    } = usePriceListByRole('distributor');

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
