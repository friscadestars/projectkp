import React from 'react';
import * as XLSX from "xlsx";
import PriceListForm from './PriceListForm';
import PriceListSearch from '../../Common/SearchInput';
import PriceListTable from './PriceListTable';

const PriceListSection = ({
    form,
    setForm,
    handleAdd,
    handleImport,
    searchTerm,
    setSearchTerm,
    filteredProduk,
    handleEdit,
    handleSave,
    handleDelete,
    hargaLabel = "Harga",
    hargaHeader = "Harga",
    canEdit = true,
    loading = false,
}) => {
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);
            handleImport(json);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <span className="ml-2 text-gray-600">Memuat data....</span>
                </div>
            ) : (
                <>
                    {canEdit && (
                        <PriceListForm
                            form={form}
                            setForm={setForm}
                            handleAdd={handleAdd}
                            hargaLabel={hargaLabel}
                        />
                    )}

                    {/* Search dan Import Excel sejajar */}
                    <div className="flex items-center mt-3">
                        <PriceListSearch
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {canEdit && (
                            <div className="ml-2 -mt-4">
                                <label className="cursor-pointer bg-green-700 text-white px-4 py-2 rounded font-bold">
                                    Import Excel
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    <PriceListTable
                        filteredProduk={filteredProduk}
                        handleEdit={canEdit ? handleEdit : undefined}
                        handleSave={canEdit ? handleSave : undefined}
                        handleDelete={canEdit ? handleDelete : undefined}
                        hargaHeader={hargaHeader}
                        canEdit={canEdit}
                    />
                </>
            )}
        </div>
    );
};

export default PriceListSection;
