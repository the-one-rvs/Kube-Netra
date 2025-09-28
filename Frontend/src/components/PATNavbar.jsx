import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

const PATNavbar = ({ onSearch }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("patSearchTerm");
    if (saved) {
      setQuery(saved);
      onSearch(saved);
    }
  }, [onSearch]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    localStorage.setItem("patSearchTerm", val);
    onSearch(val);
  };

  return (
    <nav className="w-full max-w-6xl bg-white/90 backdrop-blur-md shadow-md rounded-full mt-4 px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
        <h1 className="text-xl font-bold text-yellow-600">Kube-Netra </h1>
      </div>

      {/* Search + Profile */}
      <div className="flex items-center space-x-4">
        {searchOpen && (
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search PAT..."
            className="px-3 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <Search
          className="cursor-pointer text-gray-600 hover:text-blue-600"
          onClick={() => setSearchOpen(!searchOpen)}
        />

        <ProfileMenu />
      </div>
    </nav>
  );
};

export default PATNavbar;
