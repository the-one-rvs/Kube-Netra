// src/components/ProjectPageNavbar.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Edit3, LogOut } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { deleteProject, exitProject } from "../features/projects/projectOpSlice";
import { fetchCurrentProject } from "../features/projects/projectSlice";

const ProjectPageNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProject, loading } = useSelector((state) => state.projects);

  // ✅ Fetch current project on mount
  useEffect(() => {
    dispatch(fetchCurrentProject());
  }, [dispatch]);

  // ✅ Update handler
  const handleUpdate = () => {
    if (!currentProject?._id) return;
    navigate(`/projects/${currentProject._id}/update`);
  };

  // ✅ Delete handler
  const handleDelete = async () => {
    if (!currentProject?._id) return;
    try {
      await dispatch(deleteProject()).unwrap();
      navigate("/projects");
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // ✅ Exit handler
  const handleExit = async () => {
    if (!currentProject?._id) return;
    try {
      await dispatch(exitProject()).unwrap();
      navigate("/projects");
    } catch (err) {
      console.error("❌ Exit failed:", err);
    }
  };

  return (
    <nav className="w-full max-w-6xl bg-white/90 backdrop-blur-md shadow-md rounded-full mt-4 px-6 py-3 flex justify-between items-center">
      {/* Logo + Project Name */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="/logo.png" alt="Kube-Netra" className="h-8 w-8 mr-2" />
        <span className="text-xl font-bold text-red-700">Kube-Netra</span>

        {/* Project name */}
        {currentProject?.name && (
          <span className="ml-4 px-3 py-1 bg-gradient-to-r from-red-400 to-red-700 text-black font-semibold rounded-full shadow-md whitespace-nowrap">
            {currentProject.name}
          </span>
        )}

      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Update */}
        {currentProject?._id && (
          <button
            onClick={handleUpdate}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-full transition"
          >
            <Edit3 size={16} /> Update
          </button>
        )}

        {/* Delete */}
        <button
          disabled={loading}
          onClick={handleDelete}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 rounded-full transition disabled:opacity-50"
        >
          <Trash2 size={16} /> Delete
        </button>

        {/* Exit */}
        <button
          disabled={loading}
          onClick={handleExit}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition disabled:opacity-50"
        >
          <LogOut size={16} /> Exit
        </button>

        {/* Profile Menu */}
        <ProfileMenu />
      </div>
    </nav>
  );
};

export default ProjectPageNavbar;
