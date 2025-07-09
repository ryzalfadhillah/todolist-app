import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://94.74.86.174:8080/api/register", {
        email,
        username,
        password,
      });
      toast.success("Pendaftaran berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Gagal daftar! Coba periksa inputmu.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 to-purple-400">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-purple-600">
          Register
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md"
        >
          Register
        </button>
        <p className="text-sm text-center">
          Sudah punya akun?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
