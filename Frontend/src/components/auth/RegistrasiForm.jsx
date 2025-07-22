import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function RegistrasiForm() {
  const location = useLocation();
  const role = location.state?.role || "unknown";
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    namaBank: "",
    pemilikRekening: "",
    email: "",
    noRekening: "",
    noTelepon: "",
    username: "",
    alamat: "",
    password: "",
    ulangiPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showUlangiPassword, setShowUlangiPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.ulangiPassword) {
      alert("Password dan Ulangi Password tidak cocok");
      return;
    }

  const payload = {
    nama: form.nama,
    username: form.username,
    email: form.email,
    password: form.password,
    noTelepon: form.noTelepon,
    pemilikRekening: form.pemilikRekening,
    noRekening: form.noRekening,
    namaBank: form.namaBank,
    alamat: form.alamat
  };

  const token = localStorage.getItem("token"); // ✅ Ambil token dari localStorage

  try {
    const response = await fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Kirim token di header
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.messages?.error || "Gagal registrasi");
    }

    const data = await response.json();
    console.log(data);

    // ✅ Tampilkan modal success
    setShowSuccessModal(true);

    // Reset form
    setForm({
      nama: "",
      namaBank: "",
      pemilikRekening: "",
      email: "",
      noRekening: "",
      noTelepon: "",
      username: "",
      alamat: "",
      password: "",
      ulangiPassword: "",
    });
    } catch (error) {
      console.error("Registrasi error:", error.message);
      alert("Registrasi gagal: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] py-12 pb-20 bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-primary-dark mb-4 text-center">
          {role === "pabrik"
            ? "Registrasi Distributor Baru"
            : "Registrasi Agen Baru"}
        </h2>
        <p className="mb-6 text-gray-600 text-center" >
        <FaLock className="inline-block w-3 h-3 text-primary-darkest mr-2 align-baseline" />
          Anda masuk sebagai:{" "}

        <b>{role === "pabrik" ? "Pabrik" : role === "distributor" ? "Distributor" : "Tidak diketahui"}</b>

        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama Agen */}
          <Input
            label={role === "pabrik" ? "Nama Distributor*" : "Nama Agen*"}
            name="nama"
            value={form.nama}
            onChange={handleChange}
          />

          {/* Email */}
          <Input
            label="Email*"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />


          {/* Nomor Telepon */}
          <Input
            label="Nomor Telepon*"
            name="noTelepon"
            value={form.noTelepon}
            onChange={handleChange}
          />

          {/* Nama Pemilik Rekening */}
          <Input
            label="Nama Pemilik Rekening*"
            name="pemilikRekening"
            value={form.pemilikRekening}
            onChange={handleChange}
          />

          {/* Nama Bank */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Bank<span className="text-red-500">*</span>
            </label>
            <select
            name="namaBank"
            value={form.namaBank}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            required
            >
            <option value="">-- Pilih Bank --</option>
            <option value="BCA">BCA</option>
            <option value="Mandiri">Mandiri</option>
            <option value="BRI">BRI</option>
            <option value="BNI">BNI</option>
            <option value="CIMB">CIMB Niaga</option>
            <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Nomor Rekening */}
          <Input
            label="Nomor Rekening*"
            name="noRekening"
            value={form.noRekening}
            onChange={handleChange}
          />

            {/* Alamat */}
            <div>
            <label
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                Alamat<span className="text-red-500">*</span>
            </label>
            <textarea
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                rows="3" // Bisa diatur, misal rows=4 untuk lebih tinggi
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            ></textarea>
            </div>

            

          {/* Username */}
          <Input
            label="Username*"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          {/* Password */}
          <PasswordInput
            label="Password*"
            name="password"
            value={form.password}
            onChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          {/* Ulangi Password */}
          <PasswordInput
            label="Ulangi Password*"
            name="ulangiPassword"
            value={form.ulangiPassword}
            onChange={handleChange}
            showPassword={showUlangiPassword}
            setShowPassword={setShowUlangiPassword}
          />

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-primary-dark text-white py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Registrasi
            </button>
          </div>
        </form>
      </div>

      {/* Alert Regitrasi Berhasil */}
      {showSuccessModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm text-center">
          <h3 className="text-xl font-semibold text-primary-dark mb-4">
            🎉 Registrasi Berhasil!
          </h3>
          <p className="text-gray-700 mb-6">
            Akun baru berhasil dibuat.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Tetap di Halaman
            </button>
            <button
              onClick={() => {
                const role = localStorage.getItem("role"); // ambil role dari localStorage

                if (role === "pabrik") {
                  window.location.href = "/berandaPabrik";
                } else if (role === "distributor") {
                  window.location.href = "/berandaDistributor";
                } else {
                  window.location.href = "/"; // fallback ke halaman utama
                }
              }}
              className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-blue-800 transition"
            >
              Ke Beranda
            </button>
          </div>
        </div>
      </div>
    )}

    </div>

    
  );
}

function Input({ label, name, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label.replace("*", "")}
        <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );
}

function PasswordInput({ label, name, value, onChange, showPassword, setShowPassword }) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label.replace("*", "")}
        <span className="text-red-500">*</span>
      </label>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center cursor-pointer text-gray-500"
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </span>
    </div>
  );
}
