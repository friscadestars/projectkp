import { useState } from "react";

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const useOrderFormState = ({ agentId, distributorInfo, orders, setOrders, onSuccess }) => {
    const [produk, setProduk] = useState("");
    const [jumlah, setJumlah] = useState("");
    const [harga, setHarga] = useState("");
    const [alamat, setAlamat] = useState("");
    const [produkList, setProdukList] = useState([]);

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
            orderDate: formatDate(new Date()),
            address: alamat,
            status: "Tertunda",
            products: produkList.map(p => ({
                name: p.nama,
                quantity: p.jumlah,
                requestedPrice: p.harga,
                unitPrice: 0
            }))
        };

        setOrders([...orders, newOrder]);
        onSuccess?.();
        return { success: true }; // return status
    };

    return {
        produk, jumlah, harga, alamat, produkList,
        setProduk, setJumlah, setHarga, setAlamat,
        handleAddProduk, handleDeleteProduk,
        handleSubmit
    };
};

export default useOrderFormState;
