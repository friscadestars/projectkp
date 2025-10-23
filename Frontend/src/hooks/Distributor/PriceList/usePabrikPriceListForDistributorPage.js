// src/hooks/Distributor/PriceList/usePabrikPriceListForDistributorPage.js
import { usePriceListByRole } from './usePriceListByRole';
import iconHarga from '../../../assets/IconHeader/HargaIcon.png';
import { useNavigation } from '../../useNavigation';
import { distributorMenuItems } from '../../../components/ComponentsDashboard/Constants/menuItems';
import { useAuth } from '../../../Context/AuthContext';

export const usePabrikPriceListForDistributorPage = () => {
    const {
        form,
        setForm,
        searchTerm,
        setSearchTerm,
        filteredProduk,
        loading,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete
    } = usePriceListByRole('pabrik');

    const { handleNavigation } = useNavigation(distributorMenuItems);
    const { user } = useAuth();
    const isPabrik = user?.role === 'pabrik';

    return {
        form,
        setForm,
        loading,
        searchTerm,
        setSearchTerm,
        filteredProduk,
        handleAdd: isPabrik ? handleAdd : undefined,
        handleEdit: isPabrik ? handleEdit : undefined,
        handleSave: isPabrik ? handleSave : undefined,
        handleDelete: isPabrik ? handleDelete : undefined,
        layoutProps: {
            menuItems: distributorMenuItems,
            activeLabel: "Daftar Harga Pabrik",
            onNavigate: handleNavigation
        },
        pageTitleProps: {
            icon: iconHarga,
            title: "Daftar Harga Pabrik"
        },
        isPabrik
    };
};
