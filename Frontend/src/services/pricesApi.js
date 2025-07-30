const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

// Ambil daftar harga berdasarkan role
export async function fetchPrices(role) {
    const res = await fetch(`${API_BASE}/prices?role=${role}`, {
        headers: authHeader()
    });
    if (!res.ok) throw new Error(`Gagal mengambil daftar harga untuk ${role}`);
    const json = await res.json();
    return json.data || json;
}

// Tambah harga produk berdasarkan role
export async function createPrice(payload, role) {
    const res = await fetch(`${API_BASE}/prices`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            ...payload,
            role // cukup satu role
        })
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
