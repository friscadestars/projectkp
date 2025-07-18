import React from "react";
import ReusableTable from "../../../Common/ReusableTable"; // sesuaikan path jika perlu

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

export default ProductSummaryTable;
