import React from 'react';

const FilterBarRiwayat = ({ entries, onEntriesChange }) => {
    return (
        <div className="mb-4">
            {/* Filter by date */}
            <div className="flex items-center gap-2 mb-2">
                <input type="date" className="border border-gray-300 rounded px-2 py-1 text-sm" />
                <span>-</span>
                <input type="date" className="border border-gray-300 rounded px-2 py-1 text-sm" />
                <button className="bg-btn-success text-white px-3 py-1 rounded text-sm font-bold">Filter</button>
                <button className="bg-btn-dark text-white px-3 py-1 rounded text-sm font-bold">Export Excel</button>
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
