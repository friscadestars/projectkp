// src/Components/Distributor/KirimOrder/ProductDetailTable.jsx
import React from 'react';
import ReusableTable from '../../Common/ReusableTable'; // Sesuaikan path jika perlu

const ProductDetailTable = ({ products }) => {
    if (!Array.isArray(products) || products.length === 0) {
        return <p className="text-sm text-gray-500 italic mb-4">Tidak ada produk dalam order ini.</p>;
    }

    const columns = [
        { header: 'Nama Produk', key: 'name' },
        { header: 'Jumlah', key: 'quantity' }
    ];

    return (
        <div className="mb-6">
            <h2 className="font-semibold text-md mb-2">Rincian Produk</h2>
            <ReusableTable
                columns={columns}
                data={products}
                footer={
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="border-t border-gray-300 px-4 py-3 text-right text-sm text-gray-600"
                        >
                        </td>
                    </tr>
                }
            />
        </div>
    );
};

export default ProductDetailTable;