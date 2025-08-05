// src/hooks/Pabrik/Monitoring/useMonitoringDistributorPage.js
import { useEffect, useState } from 'react';
import {
    fetchDistributorsByPabrik,
    updateDistributor,
    deleteDistributor,
    setActiveDistributor,
} from '../../services/pabrik/UserDistributorApi';

import { useAuth } from '../../Context/AuthContext';
import Swal from 'sweetalert2';

export const useMonitoringDistributorPage = () => {
    const { token: ctxToken, user } = useAuth();
    const pabrikId = user?.id;
    const [searchTerm, setSearchTerm] = useState('');
    const [distributorList, setDistributorList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = ctxToken || localStorage.getItem('token');

    useEffect(() => {
        const loadDistributors = async () => {
            if (!token || !pabrikId) return;
            try {
                setLoading(true);
                setError(null);

                const result = await fetchDistributorsByPabrik(pabrikId, token);
                setDistributorList(result.map(user => ({
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
                console.error('Gagal mengambil data distributor:', err);
                setError(err.message || 'Gagal mengambil data distributor');
            } finally {
                setLoading(false);
            }
        };

        loadDistributors();
    }, [token, pabrikId]);

    const toggleAktif = async (id) => {
        const target = distributorList.find(d => d.id === id);
        if (!target) return;

        const nextActive = !target.aktif;
        const prev = distributorList;
        setDistributorList(prev => prev.map(d => d.id === id ? { ...d, aktif: nextActive } : d));

        try {
            await setActiveDistributor(id, nextActive, token);
        } catch (err) {
            console.error(err);
            alert('Gagal mengubah status aktif distributor: ' + err.message);
            setDistributorList(prev);
        }
    };

    const [selectedDistributor, setSelectedDistributor] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEdit = (id) => {
        const distributorToEdit = distributorList.find(d => d.id === id);
        setSelectedDistributor(distributorToEdit);
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

            const res = await updateDistributor(updatedData.id, payload, token);

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

            setDistributorList(prev =>
                prev.map(d => d.id === updatedData.id ? { ...d, ...fresh } : d)
            );

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Data distributor berhasil diperbarui.',
                icon: 'success',
                confirmButtonColor: '#2563eb',
            });

        } catch (err) {
            console.error(err);
            await Swal.fire({
                title: 'Gagal Memperbarui',
                text: err.message || 'Terjadi kesalahan saat memperbarui data distributor.',
                icon: 'error',
            });

        } finally {
            setShowEditModal(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Konfirmasi Hapus',
            text: 'Apakah yakin ingin menghapus distributor ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        });

        if (!result.isConfirmed) return;

        const prevState = distributorList;
        setDistributorList(prev => prev.filter(d => d.id !== id));

        try {
            await deleteDistributor(id, token);

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Distributor berhasil dihapus.',
                icon: 'success',
                confirmButtonColor: '#2563eb',
            });

        } catch (err) {
            console.error(err);
            await Swal.fire({
                title: 'Gagal Menghapus',
                text: err.message || 'Terjadi kesalahan saat menghapus distributor.',
                icon: 'error',
            });
            setDistributorList(prevState);
        }
    };

    const filteredDistributorList = distributorList
        .filter(d =>
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (d.alamat ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(d => ({
            ...d,
            onEdit: handleEdit,
            onDelete: handleDelete
        }));

    return {
        searchTerm,
        setSearchTerm,
        filteredDistributorList,
        toggleAktif,
        selectedDistributor,
        showEditModal,
        setShowEditModal,
        handleSaveEdit,
        loading,
        error,
    };
};
