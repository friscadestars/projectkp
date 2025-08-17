import React, { useState } from 'react';
import SearchInput from '../../Common/SearchInput';
import ValidasiOrderTable from './ValidasiOrderTable';

const ValidasiOrderSection = ({ orders, handleTerima, handleTolak, loading }) => {
    const [searchText, setSearchText] = useState('');

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
            <SearchInput
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <ValidasiOrderTable
                orders={orders.filter(order => order.status?.toLowerCase() === 'pending')}
                handleTerima={handleTerima}
                handleTolak={handleTolak}
                loading={loading}
            />
        </div>
    );
};

export default ValidasiOrderSection;
