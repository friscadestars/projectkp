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

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const distributorId = user?.id;

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchPrices('distributor', distributorId);
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
                harga: Number(String(form.harga).replace(/[^\d]/g, '')),
                role: 'distributor',
                distributor_id: distributorId,
            };
            await createPrice(payload, 'distributor');
            setForm({ nama: '', kode: '', harga: '' });
            await loadData();
            Swal.fire('Berhasil', 'Produk berhasil ditambahkan', 'success');
        } catch (e) {
            Swal.fire('Gagal', e.message || 'Gagal menambahkan produk', 'error');
        }
    };

    const handleEdit = (id) => {
        const produk = produkList.find(p => p.id === id);
        if (produk) {
            setForm({
                nama: produk.nama,
                kode: produk.kode,
                harga: produk.harga
            });
            setProdukList(prev =>
                prev.map(p => ({
                    ...p,
                    isEditing: p.id === id
                }))
            );
        }
    };

    const handleSave = async (id, updatedData = form) => {
        try {
            await updatePrice(id, {
                nama_produk: updatedData.nama || form.nama,
                kode_produk: updatedData.kode || form.kode,
                harga: Number(String(updatedData.harga || form.harga).replace(/[^\d]/g, '')),
            });
            setForm({ nama: '', kode: '', harga: '' });
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
            await deletePrice(id);
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
