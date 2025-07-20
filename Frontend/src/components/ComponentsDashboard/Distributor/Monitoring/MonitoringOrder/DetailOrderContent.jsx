import React from 'react';

// ReusableTable Component
const ReusableTable = ({
    columns = [],
    data = [],
    renderRow,
    footer,
    className = '',
}) => {
    const hasCustomRender = typeof renderRow === 'function';

    return (
        <div className="order-table-container">
            <table className={`order-table w-full border-collapse ${className}`.trim()}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.label || col.header}</th>
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

// Order Detail Table
const OrderDetailTable = ({ order }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia.</p>;

    const columns = [
        { header: 'Order ID', key: 'orderId' },
        { header: 'Agen ID', key: 'agenId', render: () => 'AG-001' },
        { header: 'Pabrik ID', key: 'pabrikId', render: () => 'PB-001' },
        { header: 'Tanggal Order', key: 'orderDate' },
        {
            header: 'Estimasi Sampai',
            key: 'estimatedDate',
            render: (val) => val || '-',
        },
        {
            header: 'Status Order',
            key: 'status',
            render: (val) => (
                <span className={`px-3 py-1 text-sm rounded text-white font-bold
                    ${val === 'Belum Dikirim' ? 'bg-orange-400' :
                        val === 'Diproduksi' ? 'bg-green-500' :
                            val === 'Diproses' ? 'bg-blue-500' :
                                val === 'Dikirim' ? 'bg-cyan-500' :
                                    val === 'Diterima' ? 'bg-emerald-500' :
                                        'bg-gray-400'}`}>
                    {val}
                </span>
            ),
        },
    ];

    const data = [order];

    return (
        <>
            <h2 className="font-semibold text-md mb-2">Detail Order</h2>
            <ReusableTable
                columns={columns}
                data={data}
                footer={
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="px-4 py-1 border-t border-gray-300 text-sm text-gray-600 text-right font-medium"
                        ></td>
                    </tr>
                }
            />
        </>
    );
};

// Product Summary Table
const ProductSummaryTable = ({ products }) => {
    const total = products.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0);

    const columns = [
        { header: "Nama Produk", key: "name" },
        { header: "Jumlah", key: "quantity" },
        {
            header: "Harga Jual",
            key: "unitPrice",
            render: (val) => `Rp. ${val.toLocaleString()}`,
        },
        {
            header: "Subtotal",
            key: "subtotal",
            render: (_, row) => `Rp. ${(row.unitPrice * row.quantity).toLocaleString()}`,
        },
    ];

    const data = products.map((p) => ({
        ...p,
        subtotal: p.unitPrice * p.quantity,
    }));

    return (
        <>
            <h2 className="font-semibold text-md mb-2">Rincian Produk</h2>
            <ReusableTable
                columns={columns}
                data={data}
                footer={
                    <tr className="bg-gray-200 border-t border-gray-300 font-semibold text-sm">
                        <td colSpan="3" className="py-2 px-4 text-left">
                            Total
                        </td>
                        <td className="py-2 px-4">Rp. {total.toLocaleString()}</td>
                    </tr>
                }
            />
        </>
    );
};

// Main Component
const DetailOrderContent = ({ order, titleText, icon }) => {
    if (!order) {
        return <div className="detail-order-error">Order tidak ditemukan.</div>;
    }

    return (
        <div className="p-1">
            <div className="detail-order-header flex items-center gap-2 mb-4">
                {icon && <img src={icon} alt="Icon" className="detail-order-icon w-6 h-6" />}
                <h1 className="detail-order-title text-lg font-semibold">{titleText}</h1>
            </div>

            <div className="detail-order-container">
                <OrderDetailTable order={order} />
                <ProductSummaryTable products={order.products} />
            </div>
        </div>
    );
};

export default DetailOrderContent;
