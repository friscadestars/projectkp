// src/services/distributor/UserAgenApi.js
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const withAuth = (token) => ({
    Authorization: `Bearer ${token}`
});

const safeJson = async (res) => {
    const text = await res.text();
    if (!text) return {};
    try {
        return JSON.parse(text);
    } catch {
        return {};
    }
};

export const fetchAgents = async (token) => {
    if (!token) throw new Error('Token tidak ditemukan');

    const res = await fetch(`${BASE_URL}/users?role=agen`, {
        headers: {
            'Content-Type': 'application/json',
            ...withAuth(token),
        },
    });

    if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err.message || 'Gagal mengambil data agen');
    }

    return await res.json();
};

export const updateAgent = async (id, data, token) => {
    if (!token) throw new Error('Token tidak ditemukan');

    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...withAuth(token)
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err.message || 'Gagal update agen');
    }

    const json = await safeJson(res);
    return json;
};

export const deleteAgent = async (id, token) => {
    if (!token) throw new Error('Token tidak ditemukan');

    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...withAuth(token)
        }
    });

    if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err.message || 'Gagal menghapus agen');
    }

    return await safeJson(res);
};

export const setActiveAgent = async (id, isActive, token) => {
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
        throw new Error(err.message || 'Gagal mengubah status aktif agen');
    }

    return await safeJson(res);
};


export const fetchAgentsByDistributor = async (distributorId, token) => {
    if (!token) throw new Error('Token tidak ditemukan');
    const res = await fetch(`${BASE_URL}/agen-distributor/by-distributor/${distributorId}`, {
        headers: {
            'Content-Type': 'application/json',
            ...withAuth(token)
        }
    });
    if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err.message || 'Gagal mengambil agen by distributor');
    }
    return await res.json();
};

export const fetchUserById = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/users/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Gagal fetch user');
    return res.json();
};