import React from "react";
import ReusableTable from "../../../Common/ReusableTable"; // sesuaikan path jika perlu

const ProductSummaryTable = ({ products }) => {
    const data = products.map(p => ({
        ...p,
        quantity: parseInt(p.quantity),
        unit_price: parseFloat(p.unit_price),
        subtotal: parseFloat(p.unit_price) * parseInt(p.quantity),
    }));

    const total = data.reduce((sum, p) => sum + p.subtotal, 0);

    const columns = [
        { header: "Nama Produk", key: "product_name" },
        { header: "Jumlah", key: "quantity" },
        {
            header: "Harga Jual",
            key: "unit_price",
            render: (val) => `Rp. ${(val ?? 0).toLocaleString("id-ID")}`,
        },
        {
            header: "Subtotal",
            key: "subtotal",
            render: (val) => `Rp. ${(val ?? 0).toLocaleString("id-ID")}`,
        },
    ];

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
                        <td className="py-2 px-4">Rp. {total.toLocaleString("id-ID")}</td>
                    </tr>
                }
            />
        </>
    );
};

export default ProductSummaryTable;
