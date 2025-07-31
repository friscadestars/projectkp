const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

// Ambil daftar harga berdasarkan role
export async function fetchPrices(role, userId) {
    if (!['distributor', 'pabrik'].includes(role)) {
        throw new Error('Role tidak memiliki akses ke daftar harga');
    }

    const queryParams = new URLSearchParams({ role });

    if (role === 'distributor' && userId) {
        queryParams.append('distributor_id', userId);
    }

    const res = await fetch(`${API_BASE}/prices?${queryParams.toString()}`, {
        headers: authHeader()
    });

    if (!res.ok) {
        throw new Error(`Gagal mengambil daftar harga untuk ${role}`);
    }

    const json = await res.json();
    return json.data || json;
}

// Tambah harga produk berdasarkan role
export async function createPrice(payload, role, userId = null) {
    const roleKey = {
        distributor: 'distributor_id',
        pabrik: 'pabrik_id',
        agen: 'agen_id'
    };

    const body = {
        ...payload,
        role,
        ...(userId && roleKey[role] ? { [roleKey[role]]: userId } : {})
    };

    const res = await fetch(`${API_BASE}/prices`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `Gagal membuat harga untuk ${role}`);
    }

    const json = await res.json();
    return json.data || json;
}

export async function updatePrice(id, payload) {
    const res = await fetch(`${API_BASE}/prices/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal update harga');
    }
    const json = await res.json();
    return json.data || json;
}


export async function deletePrice(id) {
    const res = await fetch(`${API_BASE}/prices/${id}`, {
        method: 'DELETE',
        headers: authHeader()
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal menghapus harga');
    }

    return true;
}

// Ambil daftar harga distributor
export async function getPriceListByDistributor(distributorId) {
    const res = await fetch(`${API_BASE}/prices?role=distributor&distributorId=${distributorId}`, {
        headers: authHeader()
    });
    if (!res.ok) throw new Error('Gagal mengambil harga distributor');
    const json = await res.json();
    return json.data || json;
}

// Ambil daftar harga pabrik
export async function getPriceListByPabrik() {
    const res = await fetch(`${API_BASE}/prices?role=pabrik`, {
        headers: authHeader()
    });
    if (!res.ok) throw new Error('Gagal mengambil harga pabrik');
    const json = await res.json();
    return json.data || json;
}

