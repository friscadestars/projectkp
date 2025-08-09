import React from 'react';
import ReusableTable from '../Common/ReusableTable';

const InvoiceTable = ({ products = [] }) => {
    console.log('products', products);
    const total = products.reduce((acc, item) => {
        const harga = parseFloat(item.unitPrice) || 0;
        const qty = parseInt(item.quantity, 10) || 0;
        return acc + (harga * qty);
    }, 0);

    const columns = [
        {
            key: 'name',
            label: 'Nama Produk',
        },
        {
            key: 'quantity',
            label: 'Jumlah',
            render: (val) => {
                const numeric = parseInt(val, 10) || 0;
                return <div className="text-center">{numeric}</div>;
            },
        },
        {
            key: 'unitPrice',
            label: 'Harga Satuan',
            render: (val) => {
                const numeric = typeof val === 'string' ? parseFloat(val) : val;
                return (
                    <div className="text-center">
                        Rp {numeric.toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                    </div>
                );
            },
        },
        {
            label: 'Subtotal',
            key: 'subtotal',
            render: (_, row) => {
                const harga = parseFloat(row.unitPrice) || 0;
                const qty = parseInt(row.quantity, 10) || 0;
                const subtotal = harga * qty;
                return `Rp ${subtotal.toLocaleString('id-ID')}`;
            },
        },
    ];

    const data = products.map(p => ({
        ...p,
        subtotal: null, // tetap biarkan, render akan handle
    }));

    return (
        <div className="mb-6 overflow-x-auto">
            <ReusableTable
                columns={columns}
                data={data}
                className="min-w-full table-auto border border-gray-300 text-sm"
            />

            {/* Total Section pakai <table> agar sejajar */}
            <table className="min-w-full table-auto border border-t-0 border-gray-300 text-sm">
                <tfoot>
                    <tr className="bg-gray-100 font-semibold">
                        <td className="text-left pl-6 py-2 font-bold" colSpan={3}>
                            Total
                        </td>
                        <td className="text-right pr-28 py-2 font-bold">
                            Rp {total.toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>

    );
};

export default InvoiceTable;
