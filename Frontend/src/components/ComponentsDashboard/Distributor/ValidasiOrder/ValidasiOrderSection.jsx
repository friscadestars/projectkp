import React from 'react';
import SearchInput from '../../Common/SearchInput';
import ValidasiOrderTable from './ValidasiOrderTable';

const ValidasiOrderSection = ({ orders, handleTerima, handleTolak }) => {
    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
            <SearchInput />
            <ValidasiOrderTable
                orders={orders}
                handleTerima={handleTerima}
                handleTolak={handleTolak}
            />
        </div>
    );
};

export default ValidasiOrderSection;
