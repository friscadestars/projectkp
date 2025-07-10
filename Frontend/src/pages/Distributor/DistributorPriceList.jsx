import React, { useState } from 'react';
import Layout from '../../Components/ComponentsDashboard/Layout/Layout';
import PageTitle from '../../Components/ComponentsDashboard/Common/PageHeader';
import PriceListForm from '../../Components/ComponentsDashboard/Distributor/PriceList/PriceListForm';
import PriceListTable from '../../Components/ComponentsDashboard/Distributor/PriceList/PriceListTable';
import iconHarga from '../../assets/IconHeader/HargaIcon.png';
import { distributorMenuItems } from '../../Components/ComponentsDashboard/Constants/menuItems';
import { useDistributorPriceList } from '../../hooks/Distributor/useDistributorPriceList';
import { useNavigation } from '../../hooks/useNavigation';

const DistributorPriceList = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const {
        form, setForm,
        searchTerm, setSearchTerm,
        filteredProduk,
        handleAdd, handleEdit, handleSave, handleDelete,
    } = useDistributorPriceList();

    const { handleNavigation } = useNavigation(distributorMenuItems);

    return (
        <Layout
            menuItems={distributorMenuItems}
            activeLabel="Daftar Harga Distributor"
            onNavigate={handleNavigation}
            showDropdown={showDropdown}
            toggleDropdown={() => setShowDropdown(!showDropdown)}
        >
            <PageTitle icon={iconHarga} title="Daftar Harga Distributor" />

            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <PriceListForm
                    form={form}
                    setForm={setForm}
                    handleAdd={handleAdd}
                    hargaLabel="Harga Distributor"
                />

                <input
                    type="text"
                    placeholder="Cari"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/4 px-3 py-2 border border-gray-300 rounded-md text-sm mt-4"
                />

                <PriceListTable
                    filteredProduk={filteredProduk}
                    handleEdit={handleEdit}
                    handleSave={handleSave}
                    handleDelete={handleDelete}
                    hargaHeader="Harga Distributor"
                />
            </div>
        </Layout>
    );
};

export default DistributorPriceList;
