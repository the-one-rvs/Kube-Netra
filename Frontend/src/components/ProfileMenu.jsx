import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../features/user/currentUserSlice";
import { logoutUser } from "../features/auth/authSlice";

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.currentUser);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) return null;
  if (!user) return null;

  const handleLogout = async () => {
    setOpen(false);
    const result = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(result)) {
      navigate("/login"); // ✅ logout ke baad login page par bhejo
    }
  };

  return (
    <div className="relative">
      {/* Profile Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="group w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-black transition-colors duration-300"
        aria-label="Open profile menu"
      >
        <User className="w-5 h-5 group-hover:text-yellow-400" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
          {/* Fullname */}
          <h2 className="text-lg font-bold text-gray-900">{user.fullname}</h2>
          {/* Username */}
          <h1 className="text-sm text-gray-500 mb-3">@{user.username}</h1>

          {/* Permissions */}
          <p className="text-xs text-gray-500 mb-2">Permissions:</p>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mb-4">
            {user.permissions?.map((perm, idx) => (
              <li key={idx}>{perm}</li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/editProfile");
              }}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/changePassword");
              }}
              className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition"
            >
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
