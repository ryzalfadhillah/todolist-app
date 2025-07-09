import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [checklists, setChecklists] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [progressMap, setProgressMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Harus login dulu");
      navigate("/login");
      return;
    }
    fetchChecklists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChecklists = async () => {
    try {
      const res = await axios.get("http://94.74.86.174:8080/api/checklist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChecklists(res.data.data);

      // Hitung progress untuk setiap checklist
      res.data.data.forEach((list) => {
        fetchProgress(list.id);
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat checklist");
    }
  };

  const fetchProgress = async (checklistId) => {
    try {
      const res = await axios.get(
        `http://94.74.86.174:8080/api/checklist/${checklistId}/item`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const items = res.data.data;
      const total = items.length;
      const done = items.filter((item) => item.itemCompletionStatus).length;
      const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

      setProgressMap((prev) => ({
        ...prev,
        [checklistId]: percentage,
      }));
    } catch (err) {
      console.error("Gagal memuat item checklist", err);
    }
  };

  const addChecklist = async () => {
    if (!newTitle.trim()) return;
    try {
      await axios.post(
        "http://94.74.86.174:8080/api/checklist",
        { name: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Checklist ditambahkan!");
      setNewTitle("");
      fetchChecklists();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan checklist");
    }
  };

  const deleteChecklist = async (id) => {
    try {
      await axios.delete(`http://94.74.86.174:8080/api/checklist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Checklist dihapus");
      fetchChecklists();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus checklist");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-white p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800">
            📋 Checklist Saya
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200 transition"
          >
            Logout
          </button>
        </div>

        <p className="mb-6 text-gray-600">
          Kelola daftar tugas, proyek, atau ide dengan mudah dan rapi.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="Contoh: Rencana Liburan"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addChecklist}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
          >
            + Tambah Checklist
          </button>
        </div>

        <div className="flex mb-4">
          <div className="mr-2">
            <input
              type="text"
              placeholder="Cari checklist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
          </div>
          <div className="flex justify-end items-center ">
            <label className="mr-2 text-sm text-gray-700">Urutkan:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-full px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {checklists
            .filter((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
              if (sortOrder === "asc") {
                return a.name.localeCompare(b.name);
              } else {
                return b.name.localeCompare(a.name);
              }
            })
            .map((item, index) => {
              const colors = [
                "bg-blue-100 text-blue-800",
                "bg-green-100 text-green-800",
                "bg-yellow-100 text-yellow-800",
                "bg-pink-100 text-pink-800",
                "bg-purple-100 text-purple-800",
                "bg-indigo-100 text-indigo-800",
              ];
              const color = colors[index % colors.length];
              const progress = progressMap[item.id] || 0;

              return (
                <li
                  key={item.id}
                  className={`p-4 rounded-lg shadow-md hover:shadow-xl transition duration-200 ${color} flex flex-col justify-between`}
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/30 rounded-full h-3 mb-1">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-700 mb-3">
                      Progress: {progress}%
                    </p>
                  </div>

                  <div className="mt-auto flex justify-between">
                    <button
                      onClick={() => navigate(`/checklist/${item.id}`)}
                      className="text-sm font-medium hover:underline"
                    >
                      ➤ Lihat Detail
                    </button>
                    <button
                      onClick={() => deleteChecklist(item.id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      ✖ Hapus
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;
