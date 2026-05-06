import { useState } from "react";
import Header from "../components/Header";

export default function Dashboard() {
  const [notes, setNotes] = useState([
    { id: 1, title: "Meeting Notes", content: "Client discussion..." },
    { id: 2, title: "Project Plan", content: "Build dashboard UI..." },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
  });


  const handleSave = () => {
    if (!form.title || !form.content) {
      return alert("All fields required");
    }

    if (editId) {
     
      setNotes(
        notes.map((n) =>
          n.id === editId ? { ...n, ...form } : n
        )
      );
    } else {
    
      setNotes([
        ...notes,
        { id: Date.now(), ...form },
      ]);
    }

    setForm({ title: "", content: "" });
    setEditId(null);
    setShowModal(false);
  };


  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditId(note.id);
    setShowModal(true);
  };


  const handleDelete = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-6">

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Add Note
          </button>
        </div>

    
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">
            No Notes Found
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <h3 className="font-semibold text-lg mb-1">
                  {note.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {note.content}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(note)}
                    className="px-3 py-1 text-sm bg-black text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(note.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-5 rounded w-80">

            <h2 className="font-semibold mb-3">
              {editId ? "Edit Note" : "Add Note"}
            </h2>

            <input
              placeholder="Title"
              className="w-full mb-2 p-2 border rounded"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              placeholder="Content"
              className="w-full mb-3 p-2 border rounded"
              value={form.content}
              onChange={(e) =>
                setForm({ ...form, content: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-black text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
