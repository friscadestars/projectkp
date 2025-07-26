import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MasukForm() {
  const [selectedRole, setSelectedRole] = useState("Agen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data?.message || "Gagal login");
      }

      const { token, user } = data;

      // Cek validitas data user
      if (!user || !user.role) {
        throw new Error("Data user tidak valid");
      }

      // Validasi role
      const expectedRole = selectedRole.toLowerCase();
      if (user.role !== expectedRole) {
        alert("Role yang dipilih tidak cocok dengan akun ini.");
        return;
      }

      // Simpan ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("users", JSON.stringify(user));

      // Navigasi
      switch (user.role) {
        case "agen":
          navigate("/berandaAgen");
          break;
        case "distributor":
          navigate("/berandaDistributor");
          break;
        case "pabrik":
          navigate("/berandaPabrik");
          break;
        default:
          alert("Role tidak dikenali!");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Login gagal: " + error.message);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-primary-dark mb-2">
          Masuk
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Silahkan masuk untuk kelola orderan Anda
        </p>

        {/* Pilih Role Masuk */}
        <div className="flex justify-center gap-3 mb-6">
          {["Agen", "Distributor", "Pabrik"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                ${selectedRole === role
                  ? "bg-primary-dark text-white border-primary-dark"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password<span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            />
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full bg-primary-dark text-white py-2 rounded-xl font-medium hover:bg-blue-800 transition duration-200"
          >
            Masuk
          </button>
        </form>

        {/* Bantuan */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Butuh bantuan?{" "}
          <a
            href="#"
            className="text-blue-700 hover:underline transition duration-200"
          >
            Hubungi Kami
          </a>
        </p>
      </div>
    </div>
  );
}
