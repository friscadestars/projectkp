// src/hooks/useUser.js
import { useMemo } from 'react';

export function useUser() {
    const token = localStorage.getItem('token');

    const user = useMemo(() => {
        if (!token) return null;

        try {
            const payload = token.split('.')[1]; // Ambil bagian payload dari token JWT
            const decoded = JSON.parse(atob(payload)); // Decode base64

            // Ambil langsung data user dari payload
            return decoded.data || null; // ⬅️ Fix: akses ke "data"
        } catch (err) {
            console.error('Token tidak valid:', err);
            return null;
        }
    }, [token]);

    return user;
}
