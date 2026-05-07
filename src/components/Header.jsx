import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosinstance";
import { FaFilter } from "react-icons/fa";

export default function Header({ setReNotes, setNotes }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("new");
  const [showFilter, setSetShowFilter] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");

      if (user) {
        setUserData(JSON.parse(user));
      }
    } catch (error) {
      console.error("Invalid user data in localStorage");
      setUserData(null);
    }
  }, []);

  const handleSave = async () => {
    try {
      if (!form.title || !form.content) {
        return toast.warning("All fields required");
      }

      setLoading(true);

      const res = await axiosInstance.post("/note", form);
      toast.success(res.data.message || "Note created");
      setForm({ title: "", content: "" });
      setShowModal(false);
      setReNotes(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = async () => {
    try {
      const res = await axiosInstance.get(
        // `/note?search=${search}&startDate=${startDate}&endDate=${endDate}`,
        `/note?search=${search}&sortType=${sortType}`,
      );
      setNotes(res.data.notes);
    } catch (error) {
      toast.error("Failed to load notes");
    } finally {
      setSetShowFilter(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("logout Successfully");
    navigate("/login");
  };

  return (
    <header className="bg-blue-400 text-black px-6 py-3 flex justify-between items-center shadow-lg">
      <h1 className="text-lg text-white font-semibold tracking-wide">
        Notes App
      </h1>

      <div className="flex items-center gap-4">
        {/* Username */}
        <span className="text-sm opacity-90 text-white">
          Welcome {userData?.name || "User"}
        </span>

        <button
          className="flex items-center gap-2 cursor-pointer bg-black text-white px-4 py-1.5 rounded hover:bg-gray-800 transition"
          onClick={() => setSetShowFilter(true)}
        >
          <FaFilter size={16} />
          Filter
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer bg-black text-white px-4 py-1.5 rounded hover:bg-gray-800 transition"
        >
          <FiLogOut size={16} />
          Logout
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded cursor-pointer"
        >
          + Add Note
        </button>
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
            <h2 className="font-semibold mb-3">Add Note</h2>

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

      {showFilter && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setSetShowFilter(false)}
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">Filter</h2>

            {/* Search Input */}
            <div className="mb-4">
              <label className="text-sm text-gray-600">Search</label>
              <input
                type="text"
                placeholder="Search notes..."
                className="p-2 border rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-[#a9827b]"
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  // fetchNotes(value);
                }}
              />
            </div>

            <div className="w-full max-w-xs">
              <label className="text-sm text-gray-600">Sort By</label>

              <select
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="new">New Data</option>
                <option value="old">Old Data</option>
              </select>
            </div>

            {/* Date Range */}
            {/* <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-sm text-gray-600">From</label>
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">To</label>
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div> */}

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setSearch("");
                  // setStartDate("");
                  // setEndDate("");
                }}
              >
                Reset
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={applyFilter}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
