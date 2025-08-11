import React, { useState, useEffect } from 'react';

const EditAgenModal = ({ agen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ ...agen });

    useEffect(() => {
        setFormData(agen);
    }, [agen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md w-full max-w-md max-h-[90vh] overflow-auto shadow-lg">
                <h2 className="text-xl font-bold mb-2 text-center">Edit Agen</h2>

                {/* Tambahan keterangan umum */}
                <p className="text-sm text-gray-600 mb-4">
                    Silakan ubah data agen pada form di bawah ini, lalu klik <strong>Simpan</strong> untuk menyimpan perubahan.
                </p>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                        <input
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">No. Telepon</label>
                        <input
                            name="telepon"
                            value={formData.telepon || ''}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">No. Rekening</label>
                        <input
                            name="rekening"
                            value={formData.rekening || ''}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Rekening</label>
                        <input
                            name="namaRekening"
                            value={formData.namaRekening || ''}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Bank</label>
                        <input
                            name="namaBank"
                            value={formData.namaBank || ''}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Alamat</label>
                        <input
                            name="alamat"
                            value={formData.alamat || ''}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAgenModal;
