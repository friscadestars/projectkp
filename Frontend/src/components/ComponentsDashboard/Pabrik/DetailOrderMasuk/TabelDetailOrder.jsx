import React from 'react';
import ReusableTable from '../../Common/ReusableTable'; 

const getStatusClasses = (status) => {
    switch (status) {
        case 'Belum Dikirim': return 'bg-btn-danger text-white font-bold';
        case 'Sedang Diproduksi': return 'bg-blue-500 text-white font-bold'; 
        case 'Diproduksi': return 'bg-yellow-500 text-white font-bold';
        case 'Dikirim': return 'bg-blue-500 text-white font-bold';
        case 'Selesai': return 'bg-green-700 text-white font-bold';
        default: return 'bg-gray-300 text-gray-700 font-bold';
    }
};

const TabelDetailOrder = ({ order }) => {
    if (!order) return <p className="text-gray-500 italic">Data order tidak tersedia.</p>;

    const columns = [
        { key: 'orderId', label: 'Order ID' },
        { key: 'distributorName', label: 'Distributor' },
        { key: 'agentId', label: 'Agen ID' },
        { key: 'alamat', label: 'Alamat Agen' },
        { key: 'orderDate', label: 'Tanggal Order' },
        {
            key: 'status',
            label: 'Status Order',
            render: (value) => {
                let displayText = value;

                // Pemetaan status backend ke label yang ditampilkan
                switch (value) {
                    case 'approved':
                        displayText = 'Belum Dikirim';
                        break;
                    case 'processing':
                        displayText = 'Sedang Diproduksi';
                        break;
                    case 'produced':
                        displayText = 'Diproduksi';
                        break;
                    case 'shipped':
                        displayText = 'Dikirim';
                        break;
                    case 'completed':
                        displayText = 'Selesai';
                        break;
                    default:
                        displayText = value;
                }

                return (
                    <span className={`px-3 py-1 rounded text-sm ${getStatusClasses(displayText)}`}>
                        {displayText}
                    </span>
                );
            }
        },
    ];

    const data = [order];

    return (
        <div>
            <h2 className="text-lg font-semibold mb-1.5">Detail Order</h2>
            <div className=" border border-gray-200 shadow overflow-hidden">
                <ReusableTable
                    columns={columns}
                    data={data}
                    className="min-w-full text-sm text-center whitespace-nowrap"
                />
            </div>
        </div>
    );
};

export default TabelDetailOrder;
