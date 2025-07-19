// src/pages/agen/formpermintaanorder/useOrderFormState.js
import { useState } from "react"; // ✅ Tambahkan ini
import { useOrder } from "../../../Context/OrderContext"; 

const useOrderFormState = ({ agentId, distributorInfo, orders, setOrders, onSuccess }) => {
    const [produk, setProduk] = useState("");
    const [jumlah, setJumlah] = useState("");
    const [harga, setHarga] = useState("");
    const [alamat, setAlamat] = useState("");
    const [produkList, setProdukList] = useState([]);

    const { addNewOrder } = useOrder(); 

    const handleAddProduk = () => {
        if (produk && jumlah && harga) {
            setProdukList([...produkList, { nama: produk, jumlah: +jumlah, harga: +harga }]);
            setProduk(""); setJumlah(""); setHarga("");
        }
    };

    const handleDeleteProduk = (index) => {
        const updated = [...produkList];
        updated.splice(index, 1);
        setProdukList(updated);
    };

    const handleSubmit = async () => {
        if (produkList.length === 0) {
            return { success: false, message: "Tambahkan setidaknya satu produk sebelum mengirim permintaan." };
        }

        const newOrder = {
            id: orders.length + 1,
            orderId: `ORD-00${orders.length + 1}`,
            agentId: agentId,
            distributorId: distributorInfo.id,
            distributor: distributorInfo.name,
            orderDate: new Date().toLocaleDateString('id-ID'),
            address: alamat,
            status: "Tertunda",
            products: produkList.map(p => ({
                name: p.nama,
                quantity: p.jumlah,
                requestedPrice: p.harga,
                unitPrice: 0
            }))
        };

        addNewOrder(newOrder); 
        onSuccess?.();
        return { success: true };
    };

    return {
        produk, jumlah, harga, alamat, produkList,
        setProduk, setJumlah, setHarga, setAlamat,
        handleAddProduk, handleDeleteProduk,
        handleSubmit
    };
};

export default useOrderFormState; // ✅ Tambahkan ini agar bisa di-import default
