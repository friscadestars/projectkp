import React, { useState, useEffect } from 'react';

const EditDistributorModal = ({ distributor, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...distributor });

  useEffect(() => {
    setFormData(distributor);
  }, [distributor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Distributor</h2>

        <div className="space-y-3">
          <div>
            <label>Nama Distributor</label>
            <input name="distributor" value={formData.distributor || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>Email</label>
            <input name="email" value={formData.email || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>No. Telepon</label>
            <input name="noTelepon" value={formData.noTelepon || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>No. Rekening</label>
            <input name="noRek" value={formData.noRek || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>Nama Rekening</label>
            <input name="namaRekening" value={formData.namaRekening || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>Nama Bank</label>
            <input name="namaBank" value={formData.namaBank || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>Alamat</label>
            <input name="address" value={formData.address || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Batal</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
        </div>
      </div>
    </div>
  );
};

export default EditDistributorModal;
