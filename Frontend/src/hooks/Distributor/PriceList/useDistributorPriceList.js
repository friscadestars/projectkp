import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    fetchPrices,
    createPrice,
    updatePrice,
    deletePrice
} from "../../../services/pricesApi";

export const useDistributorPriceList = () => {
    const [produkList, setProdukList] = useState([]);
    const [form, setForm] = useState({ nama: '', kode: '', harga: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchPrices('distributor'); // ✅ per role
            setProdukList(
                data.map(p => ({
                    id: p.id,
                    nama: p.nama_produk,
                    kode: p.kode_produk,
                    harga: Number(p.harga),
                    isEditing: false
                }))
            );
        } catch (e) {
            console.error(e);
            Swal.fire('Gagal', e.message || 'Gagal memuat daftar harga', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = async () => {
        if (!form.nama || !form.kode || !form.harga) {
            Swal.fire('Ops', 'Semua field harus diisi', 'warning');
            return;
        }
        try {
            const payload = {
                nama_produk: form.nama,
                kode_produk: form.kode,
                harga: Number(String(form.harga).replace(/[^\d]/g, ''))
            };
            await createPrice(payload, 'distributor'); // ✅ per role
            setForm({ nama: '', kode: '', harga: '' });
            await loadData();
            Swal.fire('Berhasil', 'Produk berhasil ditambahkan', 'success');
        } catch (e) {
            Swal.fire('Gagal', e.message || 'Gagal menambahkan produk', 'error');
        }
    };

    const handleEdit = (id) => {
        setProdukList(prev =>
            prev.map(p => (p.id === id ? { ...p, isEditing: true } : p))
        );
    };

    const handleSave = async (id, updatedData) => {
        try {
            await updatePrice(id, {
                nama_produk: updatedData.nama_produk,
                kode_produk: updatedData.kode_produk,
                harga: updatedData.harga
            });
            await loadData();
            Swal.fire('Tersimpan', 'Produk berhasil diperbarui', 'success');
        } catch (e) {
            Swal.fire('Gagal', e.message || 'Gagal memperbarui produk', 'error');
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            icon: 'warning',
            title: 'Hapus produk?',
            text: 'Tindakan ini tidak dapat dibatalkan.',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
        });
        if (!confirm.isConfirmed) return;

        try {
            await deletePrice(id); // ✅ nama fungsi disesuaikan
            await loadData();
            Swal.fire('Terhapus', 'Produk berhasil dihapus', 'success');
        } catch (e) {
            Swal.fire('Gagal', e.message || 'Gagal menghapus produk', 'error');
        }
    };

    const filteredProduk = produkList.filter(p =>
        (p.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.kode || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        loading,
        produkList,
        form,
        setForm,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete,
        searchTerm,
        setSearchTerm,
        filteredProduk,
    };
};
