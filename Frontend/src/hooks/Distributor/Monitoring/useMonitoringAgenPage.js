// src/hooks/Distributor/Monitoring/useMonitoringAgenPage.js
import { useEffect, useState } from 'react';
import {
    fetchAgentsByDistributor,
    updateAgent,
    deleteAgent,
    setActiveAgent,
} from '../../../services/UserAgenApi';


import { useAuth } from '../../../Context/AuthContext';
import Swal from 'sweetalert2';

export const useMonitoringAgenPage = () => {
    const { token: ctxToken, user } = useAuth();
    const distributorId = user?.id;
    const [searchTerm, setSearchTerm] = useState('');
    const [agenList, setAgenList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = ctxToken || localStorage.getItem('token');

    useEffect(() => {
        console.log('🧪 user (from AuthContext):', user);
        console.log('🧪 distributorId:', distributorId);
        console.log('🧪 token:', token);
        const loadAgents = async () => {
            if (!token || !distributorId) return;
            try {
                setLoading(true);
                setError(null);

                const result = await fetchAgentsByDistributor(distributorId, token);
                console.log("🔥 result from API:", result);


                setAgenList(result.map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    telepon: user.no_telp,
                    rekening: user.rekening,
                    namaRekening: user.nama_rekening,
                    namaBank: user.nama_bank,
                    alamat: user.alamat,
                    terakhirOrder: user.last_order_date
                        ? new Date(user.last_order_date).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })
                        : '-',
                    aktif: String(user.is_active) === '1',
                })));
            } catch (err) {
                console.error('Gagal mengambil data agen:', err);
                setError(err.message || 'Gagal mengambil data agen');
            } finally {
                setLoading(false);
            }
        };

        loadAgents();
    }, [token, distributorId]);

    const toggleAktif = async (id) => {
        const target = agenList.find(a => a.id === id);
        if (!target) return;

        const nextActive = !target.aktif;
        const prev = agenList;
        setAgenList(prev => prev.map(a => a.id === id ? { ...a, aktif: nextActive } : a));

        try {
            await setActiveAgent(id, nextActive, token);
        } catch (err) {
            console.error(err);
            alert('Gagal mengubah status aktif agen: ' + err.message);
            // rollback
            setAgenList(prev);
        }
    };

    const [selectedAgen, setSelectedAgen] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEdit = (id) => {
        const agenToEdit = agenList.find(a => a.id === id);
        setSelectedAgen(agenToEdit);
        setShowEditModal(true);
    };

    const handleSaveEdit = async (updatedData) => {
        try {
            const payload = {
                name: updatedData.name,
                email: updatedData.email,
                no_telp: updatedData.telepon,
                rekening: updatedData.rekening,
                nama_rekening: updatedData.namaRekening,
                nama_bank: updatedData.namaBank,
                alamat: updatedData.alamat,
            };

            const res = await updateAgent(updatedData.id, payload, token);

            const fresh = res?.data
                ? {
                    id: res.data.id,
                    name: res.data.name,
                    email: res.data.email,
                    telepon: res.data.no_telp,
                    rekening: res.data.rekening,
                    namaRekening: res.data.nama_rekening,
                    namaBank: res.data.nama_bank,
                    alamat: res.data.alamat,
                    terakhirOrder: '-',
                    aktif: true,
                }
                : updatedData;

            setAgenList(prev =>
                prev.map(agen => agen.id === updatedData.id ? { ...agen, ...fresh } : agen)
            );

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Data agen berhasil diperbarui.',
                icon: 'success',
                confirmButtonColor: '#2563eb',
            });

        } catch (err) {
            console.error(err);

            await Swal.fire({
                title: 'Gagal Memperbarui',
                text: err.message || 'Terjadi kesalahan saat memperbarui data agen.',
                icon: 'error',
            });

        } finally {
            setShowEditModal(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Konfirmasi Hapus',
            text: 'Apakah yakin ingin menghapus agen ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        });

        if (!result.isConfirmed) return;

        const prevState = agenList;
        setAgenList(prev => prev.filter(agen => agen.id !== id));

        try {
            await deleteAgent(id, token);

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Agen berhasil dihapus.',
                icon: 'success',
                confirmButtonColor: '#2563eb',
            });

        } catch (err) {
            console.error(err);

            await Swal.fire({
                title: 'Gagal Menghapus',
                text: err.message || 'Terjadi kesalahan saat menghapus agen.',
                icon: 'error',
            });

            // rollback
            setAgenList(prevState);
        }
    };

    const filteredAgenList = agenList
        .filter(agen =>
            agen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (agen.alamat ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(agen => ({
            ...agen,
            onEdit: handleEdit,
            onDelete: handleDelete
        }));

    return {
        searchTerm,
        setSearchTerm,
        filteredAgenList,
        toggleAktif,
        selectedAgen,
        showEditModal,
        setShowEditModal,
        handleSaveEdit,
        loading,
        error,
    };
};
