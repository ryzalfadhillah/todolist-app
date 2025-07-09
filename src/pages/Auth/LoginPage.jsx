import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://94.74.86.174:8080/api/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.data.token);
      toast.success("Login berhasil!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Login gagal! Periksa username dan password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-300 to-indigo-400">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Login
        </h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
        >
          Login
        </button>
        <p className="text-sm text-center">
          Belum punya akun?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Daftar
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
