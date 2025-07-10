// src/Components/Distributor/PabrikPriceList/PriceListSection.jsx
import React from 'react';
import PriceListForm from './PriceListForm';
import PriceListSearch from '../../Common/SearchInput';
import PriceListTable from './PriceListTable';

const PriceListSection = ({
    form,
    setForm,
    handleAdd,
    searchTerm,
    setSearchTerm,
    filteredProduk,
    handleEdit,
    handleSave,
    handleDelete
}) => {
    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
            <PriceListForm form={form} setForm={setForm} handleAdd={handleAdd} />
            <PriceListSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <PriceListTable
                filteredProduk={filteredProduk}
                handleEdit={handleEdit}
                handleSave={handleSave}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default PriceListSection;
