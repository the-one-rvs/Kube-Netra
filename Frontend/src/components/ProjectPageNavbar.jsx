// src/components/ProjectPageNavbar.jsx
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Trash2, Edit3, LogOut } from "lucide-react";

const ProjectPageNavbar = () => {
  const navigate = useNavigate();
  const { currentProject } = useSelector((state) => state.projects); // ✅ redux se le rahe hain

  return (
    <nav className="w-full max-w-6xl bg-white/90 backdrop-blur-md shadow-md rounded-full mt-4 px-6 py-3 flex justify-between items-center">
      {/* Logo + Project Name */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/logo.png" // replace with your logo path
          alt="Kube-Netra"
          className="h-8 w-8 mr-2"
        />

        <span className="text-xl font-bold text-red-700">Kube-Netra</span>
        {currentProject && (
          <span className="ml-4 text-lg font-medium text-gray-700">
            {currentProject.name}
          </span>
        )}
      </div>
        
      {/* </div> */}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("update")}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-full transition"
        >
          <Edit3 size={16} /> Update
        </button>
        <button
          onClick={() => navigate("delete")}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 rounded-full transition"
        >
          <Trash2 size={16} /> Delete
        </button>
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition"
        >
          <LogOut size={16} /> Exit
        </button>
      </div>
    </nav>
  );
};

export default ProjectPageNavbar;
