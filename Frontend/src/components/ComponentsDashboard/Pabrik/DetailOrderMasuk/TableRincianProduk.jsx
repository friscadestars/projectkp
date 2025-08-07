// import React from 'react';

import ReusableTable from '../../Common/ReusableTable';

const TabelRincianProduk = ({ products = [], onMulaiProduksi }) => {
    if (products.length === 0) {
        return <p className="text-gray-500 italic">Tidak ada produk.</p>;
    }

    const columns = [
        { label: 'Nama Produk', key: 'name' },
        { label: 'Jumlah', key: 'quantity' },
    ];

    return (
        <div>
            <h2 className="text-lg font-semibold mb-1.5">Rincian Produk</h2>
            <div className="border border-gray-200 shadow overflow-hidden">
                <ReusableTable
                    columns={columns}
                    data={products}
                    className="min-w-full text-sm text-center whitespace-nowrap"
                />
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    className="bg-btn-info text-white px-4 py-2 rounded hover:bg-btn-primary font-semibold"
                    onClick={onMulaiProduksi}
                >
                    Mulai Produksi
                </button>
            </div>
        </div>
    );
};

export default TabelRincianProduk;


// import ReusableTable from '../../Common/ReusableTable';

// const TabelRincianProduk = ({ products = [] }) => {
//     if (products.length === 0) {
//         return <p className="text-gray-500 italic">Tidak ada produk.</p>;
//     }

//     const columns = [
//         { label: 'Nama Produk', key: 'name' },
//         { label: 'Jumlah', key: 'quantity' },
//     ];

//     return (
//         <div>
//             <h2 className="text-lg font-semibold mb-1.5">Rincian Produk</h2>

//             {/* Table wrapper */}
//             <div className="border border-gray-200 shadow overflow-hidden">
//                 <ReusableTable
//                     columns={columns}
//                     data={products}
//                     className="min-w-full text-sm text-center whitespace-nowrap"
//                 />
//             </div>

//             <div className="mt-4 flex justify-end">
//                 <button className="bg-btn-info text-white px-4 py-2 rounded hover:bg-btn-primary font-semibold">
//                     Mulai Produksi
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default TabelRincianProduk;

// =================================================

// import React, { useState } from 'react';
// import Swal from 'sweetalert2';
// import ReusableTable from '../../Common/ReusableTable';

// const TabelRincianProduk = ({ products = [], onProduksi }) => {
//     const [statusProduksi, setStatusProduksi] = useState('Belum Dikirim');


//     if (products.length === 0) {
//         return <p className="text-gray-500 italic">Tidak ada produk.</p>;
//     }

//     const columns = [
//         { label: 'Nama Produk', key: 'name' },
//         { label: 'Jumlah', key: 'quantity' },
//     ];

//     const handleMulaiProduksi = async () => {
//         const result = await Swal.fire({
//             title: 'Konfirmasi Produksi',
//             text: 'Apakah Anda yakin ingin memulai produksi?',
//             icon: 'question',
//             showCancelButton: true,
//             confirmButtonText: 'Ya, Mulai',
//             cancelButtonText: 'Batal',
//             confirmButtonColor: '#16a34a',
//             cancelButtonColor: '#d33',
//         });

//         if (result.isConfirmed) {
//             setStatusProduksi('Mulai Produksi');

//             // Kirim ke parent (halaman utama) agar status order diubah juga
//             if (onProduksi) {
//                 onProduksi('Mulai Produksi');
//             }

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Produksi dimulai!',
//                 showConfirmButton: false,
//                 timer: 1500,
//             });
//         }
//     };

//     return (
//         <div>
//             <h2 className="text-lg font-semibold mb-1.5">Rincian Produk</h2>

//             <div className="border border-gray-200 shadow overflow-hidden">
//                 <ReusableTable
//                     columns={columns}
//                     data={products}
//                     className="min-w-full text-sm text-center whitespace-nowrap"
//                 />
//             </div>

//             <div className="mt-4 flex justify-end">
//                 <button
//                     className="bg-btn-info text-white px-4 py-2 rounded hover:bg-btn-primary font-semibold"
//                     onClick={handleMulaiProduksi}
//                 >
//                     Mulai Produksi
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default TabelRincianProduk;
