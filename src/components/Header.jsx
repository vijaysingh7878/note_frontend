import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-[#a9827b] text-white px-6 py-3 flex justify-between items-center shadow-lg">
      
      {/* Left */}
      <h1 className="text-lg font-semibold tracking-wide">
        Notes App
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">

        <span className="text-sm opacity-90">
          Welcome Vijay
        </span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded hover:bg-gray-800 transition cursor-pointer"
        >
          <FiLogOut size={16} />
          Logout
        </button>

      </div>

    </header>
  );
}