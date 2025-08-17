// src/hooks/Distributor/PriceList/useDistributorPriceListPage.js
import { usePriceListByRole } from './usePriceListByRole'; // path disesuaikan
import iconHarga from '../../../assets/IconHeader/HargaIcon.png';
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';

export const useDistributorPriceListPage = () => {
    const { handleNavigation } = useNavigation(distributorMenuItems);

    // Ambil user login dari localStorage atau context auth
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const distributorId = user?.id; // Pastikan ini adalah distributor_id dari user login

    const {
        form, setForm,
        searchTerm, setSearchTerm,
        filteredProduk,
        loading,
        handleAdd, handleEdit, handleSave, handleDelete
    } = usePriceListByRole('distributor', distributorId);

    return {
        form,
        setForm,
        searchTerm,
        setSearchTerm,
        filteredProduk,
        handleAdd,
        loading,
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
