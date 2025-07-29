import React, { useState } from 'react';

const FilterBarRiwayat = ({
    entries,
    onEntriesChange,
    onExportExcel,
    onFilterDate
}) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFilter = () => {
        onFilterDate(startDate, endDate);
    };

    return (
        <div className="mb-4">
            {/* Filter by date */}
            <div className="flex items-center gap-2 mb-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <span>-</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <button
                    onClick={handleFilter}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold"
                >
                    Filter
                </button>
                <button
                    onClick={onExportExcel}
                    className="bg-blue-900 text-white px-3 py-1 rounded text-sm font-bold"
                >
                    Export Excel
                </button>
            </div>

            {/* Show entries */}
            <div className="flex items-center gap-2">
                <label htmlFor="entries" className="text-sm">Show</label>
                <select
                    id="entries"
                    value={entries}
                    onChange={(e) => onEntriesChange(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="text-sm">entries</span>
            </div>
        </div>
    );
};

export default FilterBarRiwayat;
