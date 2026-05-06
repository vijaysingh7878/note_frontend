// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import axiosInstance from "../api/axiosinstance";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      if (!form.name || !form.email || !form.password) {
        return toast.warning("All fields are required");
      }

      if (form.password.length < 6) {
        return toast.warning("Password must be at least 6 characters");
      }

      setLoading(true);

      const res = await axiosInstance.post("/user/register", form);
      console.log(res);
      

      if (res?.status === 201) {
        toast.success(res.data.message || "Signup successful");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup Error:", error);

      toast.error(error?.response?.data?.message || "Signup failed, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a9827b] to-white px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-sm"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        {/* Name */}
        <div className="flex items-center border rounded-lg mb-4 px-3">
          <FiUser className="text-gray-400" />
          <input
            type="text"
            placeholder="Enter your name"
            required
            maxLength={15}
            className="w-full p-2 outline-none bg-transparent"
            value={form.name}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[A-Za-z\s]*$/.test(value)) {
                setForm({ ...form, name: value });
              }
            }}
          />
        </div>

        {/* Email */}
        <div className="flex items-center border rounded-lg mb-4 px-3">
          <FiMail className="text-gray-400" />
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-full p-2 outline-none bg-transparent"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="flex items-center border rounded-lg mb-5 px-3">
          <FiLock className="text-gray-400" />
          <input
            type="password"
            required
             maxLength={15}
            placeholder="Create password"
            className="w-full p-2 outline-none bg-transparent"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        {/* Link */}
        <p className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#a9827b] font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
