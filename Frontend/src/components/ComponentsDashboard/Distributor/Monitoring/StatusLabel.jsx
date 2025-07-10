import React from 'react';

const StatusLabel = ({ status }) => {
    const color = {
        Disetujui: 'bg-green-500',
        Diproses: 'bg-blue-500',
        Dikirim: 'bg-cyan-500',
        Diterima: 'bg-emerald-500'
    }[status] || 'bg-orange-400';

    return (
        <span className={`px-3 py-1 rounded text-sm font-bold text-white ${color}`}>
            {status || 'Belum Dikirim'}
        </span>
    );
};

export default StatusLabel;
