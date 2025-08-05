// src/services/distributor/DistributorApi.js
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const withAuth = (token) => ({
  Authorization: `Bearer ${token}`,
});

// helper tambahan agar aman saat res tidak memiliki body JSON
const safeJson = async (res) => {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

// Ambil semua distributor
export const fetchDistributors = async (token) => {
  if (!token) throw new Error('Token tidak ditemukan');

  const res = await fetch(`${BASE_URL}/users?role=distributor`, {
    headers: {
      'Content-Type': 'application/json',
      ...withAuth(token),
    },
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.message || 'Gagal mengambil data distributor');
  }

  return await res.json();
};

// Ambil distributor berdasarkan pabrik ID
export const fetchDistributorsByPabrik = async (pabrikId, token) => {
  if (!token) throw new Error('Token tidak ditemukan');

  const res = await fetch(`${BASE_URL}/distributor-pabrik/by-pabrik/${pabrikId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...withAuth(token),
    },
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.message || 'Gagal mengambil distributor by pabrik');
  }

  return await res.json();
};

// Update distributor
export const updateDistributor = async (id, data, token) => {
  if (!token) throw new Error('Token tidak ditemukan');

  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...withAuth(token),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.message || 'Gagal update distributor');
  }

  const json = await safeJson(res);
  return json;
};

// Hapus distributor
export const deleteDistributor = async (id, token) => {
  if (!token) throw new Error('Token tidak ditemukan');

  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...withAuth(token),
    },
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.message || 'Gagal menghapus distributor');
  }

  return await safeJson(res);
};

// Aktifkan/nonaktifkan distributor
export const setActiveDistributor = async (id, isActive, token) => {
  if (!token) throw new Error('Token tidak ditemukan');

  const res = await fetch(`${BASE_URL}/users/${id}/active`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...withAuth(token),
    },
    body: JSON.stringify({ is_active: isActive ? 1 : 0 }),
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.message || 'Gagal mengubah status aktif distributor');
  }

  return await safeJson(res);
};
