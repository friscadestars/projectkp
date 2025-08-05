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
    handleDelete,
    hargaLabel = "Harga",
    hargaHeader = "Harga",

    canEdit = true
}) => {
    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
            {canEdit && (
                <PriceListForm
                    form={form}
                    setForm={setForm}
                    handleAdd={handleAdd}
                    hargaLabel={hargaLabel}
                />
            )}
            <PriceListSearch
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <PriceListTable
                filteredProduk={filteredProduk}
                handleEdit={canEdit ? handleEdit : undefined}
                handleSave={canEdit ? handleSave : undefined}
                handleDelete={canEdit ? handleDelete : undefined}
                hargaHeader={hargaHeader}
                canEdit={canEdit}
            />
        </div>
    );
};

export default PriceListSection;
