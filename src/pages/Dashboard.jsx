// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosinstance";
import { toast } from "react-toastify";

export default function Dashboard() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      fetchNotes();
    }
  }, []);
  

  const fetchNotes = async (searchValue) => {
    try {
      const res = await axiosInstance.get(`/note?search=${searchValue}`);
      setNotes(res.data.notes);
    } catch (error) {
      toast.error("Failed to load notes");
    }
  };

  const handleSave = async () => {
    try {
      if (!form.title || !form.content) {
        return toast.warning("All fields required");
      }

      setLoading(true);

      if (editId) {
        await axiosInstance.put(`/note/${editId}`, form);
        toast.success("Note updated");
      } else {
        await axiosInstance.post("/note", form);
        toast.success("Note created");
      }

      fetchNotes();
      setForm({ title: "", content: "" });
      setEditId(null);
      setShowModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditId(note._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/note/${id}`);
      toast.success("Deleted successfully");
      fetchNotes();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
          {/* 🔍 Search */}
          <input
            type="text"
            placeholder="Search notes..."
            className="p-2 border rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-[#a9827b]"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              fetchNotes(value); // 🔥 API call on typing
            }}
          />

          {/* ➕ Add Button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Add Note
          </button>
        </div>

        {/* Notes */}
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">No Notes Found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div key={note._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-1">{note.title}</h3>
                <p className="text-gray-600 text-sm">{note.content}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(note)}
                    className="px-3 py-1 text-sm bg-black text-white rounded cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(note._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-5 rounded-xl w-80 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                (setShowModal(false), setForm({ title: "", content: "" }));
              }}
              className="absolute top-3 right-3 text-gray-500 cursor-pointer hover:text-black text-lg font-bold"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="font-semibold mb-3">
              {editId ? "Edit Note" : "Add Note"}
            </h2>

            {/* Title Input */}
            <input
              placeholder="Title"
              className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#a9827b]"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            {/* Content */}
            <textarea
              placeholder="Content"
              className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#a9827b]"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  (setShowModal(false), setForm({ title: "", content: "" }));
                }}
                className="px-3 py-1 text-gray-600 hover:text-black cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-black text-white px-3 py-1 rounded disabled:opacity-60 hover:bg-gray-800 cursor-pointer"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
