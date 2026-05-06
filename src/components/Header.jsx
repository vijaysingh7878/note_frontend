import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Header() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    toast.success("logout Successfully")
    navigate("/login"); 
  };

  return (
    <header className="bg-[#a9827b] text-white px-6 py-3 flex justify-between items-center shadow-lg">
      
    
      <h1 className="text-lg font-semibold tracking-wide">
        Notes App
      </h1>

    
      <div className="flex items-center gap-4">

        {/* Username */}
        <span className="text-sm opacity-90">
          Welcome {userData?.name || "User"}
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer bg-black text-white px-4 py-1.5 rounded hover:bg-gray-800 transition"
        >
          <FiLogOut size={16} />
          Logout
        </button>

      </div>
    </header>
  );
}