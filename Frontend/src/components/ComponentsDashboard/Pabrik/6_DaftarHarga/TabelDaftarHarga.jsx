import React, { useState } from "react";

const TabelDaftarHarga = ({
  products,
  updateProduct,
  deleteProduct,
  editingId,
  setEditingId,
}) => {
  const [newPrice, setNewPrice] = useState({});

  const handleEdit = (product) => {
    setEditingId(product.id);
    setNewPrice({ ...newPrice, [product.id]: product.price });
  };

  const handleSave = (id) => {
    updateProduct(id, parseInt(newPrice[id], 10));
    setEditingId(null);
  };

  return (
    <div className="rounded-lg border border-gray-200 shadow overflow-hidden">
      <table className="min-w-full text-sm text-center">
        {/* ✅ Header dengan warna biru gelap */}
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="px-4 py-2">No</th>
            <th className="px-4 py-2">Nama Produk</th>
            <th className="px-4 py-2">Kode Produk</th>
            <th className="px-4 py-2">Harga Pabrik</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p, index) => (
              <tr key={p.id} className="border-b border-gray-300 hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.code}</td>
                <td className="px-4 py-2">
                  {editingId === p.id ? (
                    <input
                      type="number"
                      value={newPrice[p.id]}
                      onChange={(e) =>
                        setNewPrice({ ...newPrice, [p.id]: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-24"
                    />
                  ) : (
                    `Rp ${p.price.toLocaleString()}`
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  {editingId === p.id ? (
                    <button
                      onClick={() => handleSave(p.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Simpan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-blue-900 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="border-t border-gray-300">
              <td colSpan="5" className="py-6 text-gray-500">
                Tidak ada data produk.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TabelDaftarHarga;
