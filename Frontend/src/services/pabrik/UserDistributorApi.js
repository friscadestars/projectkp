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

export const fetchDistributorsByPabrik = async (pabrikId, token) => {
  if (!token) throw new Error('Token tidak ditemukan');
  const res = await fetch(`${BASE_URL}/distributor-pabrik/by-pabrik/${pabrikId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...withAuth(token)
    }
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.message || 'Gagal mengambil distributor');
  }

  return await res.json();
};

export const updateDistributor = async (id, data, token) => {
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
    throw new Error(err.message || 'Gagal update distributor');
  }

  return await safeJson(res);
};

export const deleteDistributor = async (id, token) => {
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
    throw new Error(err.message || 'Gagal menghapus distributor');
  }

  return await safeJson(res);
};

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
