import React from 'react';

const ReusableTable = ({ columns = [], data = [] }) => {
    return (
        <div className="w-full">
            {/* Table view - hanya di desktop ≥1024px */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="table-auto w-full text-xs lg:text-sm text-left border-collapse">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={col.key ?? index}
                                    className="px-3 py-2 lg:px-4 lg:py-3 font-semibold text-center break-words whitespace-normal"
                                >
                                    {col.label || col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr key={row.id ?? rowIndex} className="border-b hover:bg-gray-50 transition">
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={col.key ?? colIndex}
                                            className="px-3 py-2 lg:px-4 lg:py-3 text-center align-middle break-words whitespace-normal"
                                        >
                                            {typeof col.render === 'function'
                                                ? col.render(row[col.key], row, rowIndex)
                                                : (row[col.key] ?? '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4 italic text-gray-500">
                                    Tidak ada data.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Card view - untuk layar <1024px, dibungkus agar center */}
            <div className="block lg:hidden">
                <div className="max-w-md mx-auto px-4 space-y-4">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <div key={row.id ?? rowIndex} className="border rounded-lg p-3 shadow-sm bg-white">
                                {columns.map((col, colIndex) => (
                                    <div
                                        key={col.key ?? colIndex}
                                        className="flex flex-wrap justify-between gap-2 py-1 border-b last:border-none"
                                    >
                                        <span className="font-semibold text-xs break-words whitespace-normal">
                                            {col.label || col.header}
                                        </span>

                                        {col.key === 'aksi' ? (
                                            <div className="flex flex-col gap-1 w-full sm:w-auto mt-1">
                                                {typeof col.render === 'function'
                                                    ? col.render(row[col.key], row, rowIndex)
                                                    : (row[col.key] ?? '-')}
                                            </div>
                                        ) : (
                                            <span className="text-sm break-words whitespace-normal max-w-[65%] text-right">
                                                {typeof col.render === 'function'
                                                    ? col.render(row[col.key], row, rowIndex)
                                                    : (row[col.key] ?? '-')}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 italic text-gray-500">Tidak ada data.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReusableTable;
