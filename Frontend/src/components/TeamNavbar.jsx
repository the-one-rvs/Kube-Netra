// src/components/TeamNavbar.jsx
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

const TeamNavbar = ({ onSearch }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // ✅ Restore searchTerm from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("searchTerm");
    if (saved) {
      setQuery(saved);
      onSearch(saved);
    }
  }, [onSearch]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    localStorage.setItem("searchTerm", val);
    onSearch(val);
  };

  return (
    <nav className="fixed top-4 left-0 w-full flex justify-center z-50">
      <div className="w-[90%] max-w-6xl bg-white/90 backdrop-blur-md shadow-md rounded-full px-6 py-3 flex justify-between items-center transition-all">
        
        {/* Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img src="/logo.png" alt="logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-green-700">Kube-Netra</h1>
        </div>

        {/* Search & Profile */}
        <div className="flex items-center space-x-4">
          {searchOpen && (
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search members..."
              className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <Search
            className="cursor-pointer text-gray-600 hover:text-blue-600"
            onClick={() => setSearchOpen(!searchOpen)}
          />

          <ProfileMenu />
        </div>
      </div>
    </nav>
  );
};

export default TeamNavbar;
