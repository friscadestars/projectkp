import React from 'react';
import AgenLayout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageHeader from '../../Components/ComponentsDashboard/Common/PageHeader';
import PriceListSection from '../../Components/ComponentsDashboard/Distributor/PriceList/PriceListSection';
import iconHarga from '../../assets/IconHeader/HargaIcon.png';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useDistributorPriceList } from '../../hooks/Distributor/useDistributorPriceList';
import { useNavigation } from '../../hooks/useNavigation';

const PabrikPriceList = () => {
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

    const { handleNavigation } = useNavigation(distributorMenuItems);

    return (
        <AgenLayout
            menuItems={distributorMenuItems}
            activeLabel="Daftar Harga Pabrik"
            onNavigate={handleNavigation}
        >
            <PageHeader icon={iconHarga} title="Daftar Harga Pabrik" />
            <PriceListSection
                form={form}
                setForm={setForm}
                handleAdd={handleAdd}
                handleEdit={handleEdit}
                handleSave={handleSave}
                handleDelete={handleDelete}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredProduk={filteredProduk}
            />
        </AgenLayout>
    );
};

export default PabrikPriceList;
