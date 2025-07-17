import React, { createContext, useState, useContext } from "react";

const HargaProdukContext = createContext();

const initialProducts = [
  { id: 1, name: "Produk A", code: "PRD-01", price: 20000 },
  { id: 2, name: "Produk B", code: "PRD-02", price: 20000 },
  { id: 3, name: "Produk C", code: "PRD-03", price: 20000 }
];

export const HargaProdukProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, { id: prev.length + 1, ...newProduct }]);
  };

  const updateProduct = (id, updatedPrice) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, price: updatedPrice } : p
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <HargaProdukContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </HargaProdukContext.Provider>
  );
};

export const useHargaProduk = () => useContext(HargaProdukContext);
