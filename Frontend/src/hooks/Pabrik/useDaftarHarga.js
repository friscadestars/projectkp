import { useState } from "react";
import { useHargaProduk } from "../../Context/HargaProdukContext";

export const useDaftarHarga = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useHargaProduk();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    editingId,
    setEditingId
  };
};
