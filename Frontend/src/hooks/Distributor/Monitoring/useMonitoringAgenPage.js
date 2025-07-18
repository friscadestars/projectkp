import { useState } from 'react';

export const useMonitoringAgenPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [agenList, setAgenList] = useState([
        {
            id: 1,
            name: 'Atika Aji',
            email: 'maju@gmail.com',
            rekening: '12345678765',
            namaRekening: 'Atika Aji',
            namaBank: 'BCA',
            alamat: 'Jl. Melati no.20 Jakarta',
            terakhirOrder: '10/01/2024',
            aktif: true
        },
        {
            id: 2,
            name: 'Atika Aji',
            email: 'maju@gmail.com',
            rekening: '12345678765',
            namaRekening: 'Atika Aji',
            namaBank: 'BCA',
            alamat: 'Jl. Melati no.20 Jakarta',
            terakhirOrder: '10/01/2024',
            aktif: false
        }
    ]);

    const toggleAktif = (id) => {
        setAgenList(prev =>
            prev.map(agen =>
                agen.id === id ? { ...agen, aktif: !agen.aktif } : agen
            )
        );
    };

    const filteredAgenList = agenList.filter(agen =>
        agen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agen.alamat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        searchTerm,
        setSearchTerm,
        filteredAgenList,
        toggleAktif
    };
};
