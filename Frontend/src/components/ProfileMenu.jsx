// src/components/ProfileMenu.jsx
import { useState } from "react";
import { useSelector } from "react-redux";

const ProfileMenu = () => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  if (!user) return null; // no menu if not logged in

  return (
    <div className="relative">
      {/* Profile Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full"
      >
        {user.username?.[0]?.toUpperCase() || "U"}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50">
          <p className="font-semibold text-gray-800 mb-2">{user.username}</p>
          <p className="text-xs text-gray-500 mb-3">Permissions:</p>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            {user.permissions?.map((perm, idx) => (
              <li key={idx}>{perm}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
