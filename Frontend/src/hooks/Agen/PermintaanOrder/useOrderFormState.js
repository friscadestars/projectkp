import { useState } from 'react'; 
import { useOrder } from "../../../Context/OrderContext";

const useOrderFormState = ({ agentId, distributorInfo, orders, onSuccess }) => {
  const { addNewOrder } = useOrder();

  const [produkList, setProdukList] = useState([]);
  const [produk, setProduk] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [harga, setHarga] = useState("");
  const [alamat, setAlamat] = useState("");

const handleAddProduk = () => {
  if (!produk || !jumlah || !harga) return;
  setProdukList((prev) => [
    ...prev,
    {
      nama: produk,  
      jumlah: parseInt(jumlah), 
      harga: parseInt(harga),   
    },
  ]);
  setProduk("");
  setJumlah("");
  setHarga("");
};

  const handleDeleteProduk = (index) => {
    setProdukList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!produkList.length || !alamat) {
      return { success: false, message: "Produk dan alamat harus diisi" };
    }

    const newOrder = {
      orderId: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      distributor: distributorInfo.name,
      agentId,
      factoryId: "-",
      orderDate: new Date().toLocaleDateString("id-ID"),
      shippingDate: "-",
      deliveryEstimate: "-",
      noResi: "-",
      status: "Tertunda",
      products: produkList,
      alamat,
    };

    addNewOrder(newOrder);

    // Reset form
    setProdukList([]);
    setAlamat("");
    
    if (onSuccess) onSuccess();

    return { success: true };
  };

  return {
    produk,
    jumlah,
    harga,
    produkList,
    alamat,
    setProduk,
    setJumlah,
    setHarga,
    setAlamat,
    handleAddProduk,
    handleDeleteProduk,
    handleSubmit,
  };
};

export default useOrderFormState;
