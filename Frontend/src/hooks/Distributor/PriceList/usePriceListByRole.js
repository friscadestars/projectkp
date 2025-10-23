import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    fetchPrices,
    createPrice,
    updatePrice,
    deletePrice
} from "../../../services/pricesApi";

export const usePriceListByRole = (role, userId) => {
    const [produkList, setProdukList] = useState([]);
    const [form, setForm] = useState({ nama: '', kode: '', harga: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchPrices(role, userId);
            setProdukList(
                data.map(p => ({
                    id: p.id,
                    nama: p.nama_produk,
                    kode: p.kode_produk,
                    harga: Number(p.harga),
                    isEditing: false,
                    source: p.distributor_id ? 'distributor' : 'pabrik'
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
        if (role === 'pabrik' || (role === 'distributor' && userId)) {
            loadData();
        }
    }, [role, userId]);

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

            if (role === 'distributor' && userId) {
                payload.distributor_id = userId;
            }

            await createPrice(payload, role, userId);
            setForm({ nama: '', kode: '', harga: '' });
            await loadData();
            Swal.fire('Berhasil', 'Produk berhasil ditambahkan', 'success');
        } catch (e) {
            console.error("[createPrice] Error:", e);
            Swal.fire('Gagal', e?.message || 'Gagal menambahkan produk', 'error');
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

    const handleImport = async (rows) => {
        try {
            for (const r of rows) {
                if (!r["Nama Produk"] || !r["Kode Produk"] || !r["Harga"]) continue;

                const payload = {
                    nama_produk: r["Nama Produk"],
                    kode_produk: r["Kode Produk"],
                    harga: Number(String(r["Harga"]).replace(/[^\d]/g, "")),
                };

                if (role === "distributor" && userId) {
                    payload.distributor_id = userId;
                }

                await createPrice(payload, role, userId);
            }
            await loadData();
            Swal.fire("Berhasil", "Produk berhasil diimport dari Excel", "success");
        } catch (e) {
            console.error("[handleImport] Error:", e);
            Swal.fire("Gagal", e.message || "Import produk gagal", "error");
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
    )
        .sort((a, b) => b.id - a.id);

    return {
        loading,
        produkList,
        form,
        setForm,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete,
        handleImport,
        searchTerm,
        setSearchTerm,
        filteredProduk,
    };
};
