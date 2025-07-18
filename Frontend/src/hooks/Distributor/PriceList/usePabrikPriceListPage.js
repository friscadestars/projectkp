import { useDistributorPriceList } from './useDistributorPriceList';

export const usePabrikPriceListPage = () => {
    const {
        form,
        setForm,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete,
        searchTerm,
        setSearchTerm,
        filteredProduk
    } = useDistributorPriceList();

    return {
        form,
        setForm,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete,
        searchTerm,
        setSearchTerm,
        filteredProduk
    };
};
