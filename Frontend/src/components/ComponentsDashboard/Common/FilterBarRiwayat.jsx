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
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-2 mb-2 w-full">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-full sm:w-auto max-w-full"
                />
                <span className="hidden sm:inline">-</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-full sm:w-auto max-w-full"
                />
                <button
                    onClick={handleFilter}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold w-full sm:w-auto max-w-full"
                >
                    Cari
                </button>
                <button
                    onClick={onExportExcel}
                    className="bg-blue-900 text-white px-3 py-1 rounded text-sm font-bold w-full sm:w-auto max-w-full"
                >
                    Export Excel
                </button>
            </div>

            {/* Show entries */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
                <label htmlFor="entries" className="text-sm">Show</label>
                <select
                    id="entries"
                    value={entries}
                    onChange={(e) => onEntriesChange(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-full md:w-auto"
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
