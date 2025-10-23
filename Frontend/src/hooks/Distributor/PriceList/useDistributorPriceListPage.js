import { usePriceListByRole } from './usePriceListByRole';
import iconHarga from '../../../assets/IconHeader/HargaIcon.png';
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';

export const useDistributorPriceListPage = () => {
    const { handleNavigation } = useNavigation(distributorMenuItems);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const distributorId = user?.id;

    const {
        form, setForm,
        searchTerm, setSearchTerm,
        filteredProduk,
        loading,
        handleAdd, handleEdit, handleSave, handleDelete,
        handleImport
    } = usePriceListByRole('distributor', distributorId);

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
        handleImport,
        loading,
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
