import React from 'react';

const ReusableTable = ({
    columns = [],
    data = [],
    renderRow,
    footer,
    className = '',
}) => {
    const hasCustomRender = typeof renderRow === 'function';

    return (
        <div className="order-table-container overflow-x-auto w-full">
            <table className={`order-table ${className}`.trim()}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>
                                {col.label || col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-gray-300">
                                {hasCustomRender
                                    ? renderRow(row, rowIndex)
                                    : columns.map((col, colIndex) => (
                                        <td key={colIndex}>
                                            {col.render
                                                ? col.render(row[col.key], row, rowIndex)
                                                : row[col.key]}
                                        </td>
                                    ))}
                            </tr>
                        ))
                    ) : (
                        <tr className="border-b border-gray-300">
                            <td
                                colSpan={columns.length}
                                className="text-center py-4 italic text-gray-500"
                            >
                                Tidak ada data.
                            </td>
                        </tr>
                    )}
                </tbody>

                {footer && (
                    <tfoot className="border-t border-gray-300">
                        {footer}
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default ReusableTable;
