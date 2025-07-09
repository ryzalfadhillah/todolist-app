/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ChecklistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Harus login dulu");
      navigate("/login");
      return;
    }
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/checklist/${id}/item`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data.data);
    } catch (err) {
      toast.error("Gagal mengambil data item!");
    }
  };

  const addItem = async () => {
    if (!newItemName.trim()) {
      toast.warn("Nama item tidak boleh kosong!");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/checklist/${id}/item`,
        { itemName: newItemName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Item berhasil ditambahkan!");
      setNewItemName("");
      fetchItems();
    } catch (err) {
      toast.error("Gagal menambahkan item!");
    }
  };

  const toggleItemStatus = async (itemId) => {
    try {
      await axios.put(
        `${BASE_URL}/checklist/${id}/item/${itemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchItems();
    } catch (err) {
      toast.error("Gagal ubah status!");
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`${BASE_URL}/checklist/${id}/item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item dihapus!");
      fetchItems();
    } catch (err) {
      toast.error("Gagal hapus item!");
    }
  };

  const renameItem = async (itemId) => {
    if (!editedName.trim()) {
      toast.warn("Nama item tidak boleh kosong!");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/checklist/${id}/item/rename/${itemId}`,
        { itemName: editedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Item berhasil diubah!");
      setEditingItemId(null);
      setEditedName("");
      fetchItems();
    } catch (err) {
      toast.error("Gagal mengubah item!");
    }
  };

  const totalSelesai = items.filter((item) => item.itemCompletionStatus).length;
  const totalBelum = items.filter((item) => !item.itemCompletionStatus).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-gray-800 flex items-center gap-2">
          <span role="img" aria-label="icon">
            📝
          </span>{" "}
          Detail Checklist
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Kembali ke Dashboard
        </button>

        {/* Tambah Item */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Tambah item to-do..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addItem}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Tambah
          </button>
        </div>

        {/* Label Status */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-green-600 font-semibold">
            ✅ Selesai: {totalSelesai}
          </span>
          <span className="text-yellow-600 font-semibold">
            ⏳ Belum Selesai: {totalBelum}
          </span>
        </div>

        {/* List Item */}
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex flex-col gap-2 p-4 rounded-md shadow-md ${
                item.status ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    onChange={() => toggleItemStatus(item.id)}
                    className="w-5 h-5"
                    checked={item.itemCompletionStatus}
                  />
                  {editingItemId === item.id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="border px-2 py-1 rounded-md"
                    />
                  ) : (
                    <div>
                      <span
                        className={`text-lg ${
                          item.itemCompletionStatus
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {item.name || "❗ (Tidak ada nama)"}
                      </span>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          item.itemCompletionStatus
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        (
                        {item.itemCompletionStatus
                          ? "Selesai"
                          : "Belum Selesai"}
                        )
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 items-center">
                  {editingItemId === item.id ? (
                    <>
                      <button
                        onClick={() => renameItem(item.id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => {
                          setEditingItemId(null);
                          setEditedName("");
                        }}
                        className="text-sm text-gray-600 hover:underline"
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingItemId(item.id);
                          setEditedName(item.itemName);
                        }}
                        className="text-sm text-orange-600 hover:underline"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        ❌ Hapus
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChecklistDetailPage;
