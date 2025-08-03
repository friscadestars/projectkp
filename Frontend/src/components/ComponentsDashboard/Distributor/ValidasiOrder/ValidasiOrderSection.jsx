import React, { useState } from 'react';
import SearchInput from '../../Common/SearchInput';
import ValidasiOrderTable from './ValidasiOrderTable';

const ValidasiOrderSection = ({ orders, handleTerima, handleTolak }) => {
    const [searchText, setSearchText] = useState('');

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
            <SearchInput
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <ValidasiOrderTable
                orders={orders}
                handleTerima={handleTerima}
                handleTolak={handleTolak}
            />
        </div>
    );
};

export default ValidasiOrderSection;
