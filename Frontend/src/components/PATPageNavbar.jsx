// src/components/PATPageNavbar.jsx
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Plus } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { deletePAT } from "../features/PAT/patSlice";

const PATPageNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pat } = useSelector((state) => state.patPage);

  const handleDelete = async () => {
    if (!pat?._id) return;
    try {
      await dispatch(deletePAT(pat._id)).unwrap();
      navigate("/pats");
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  return (
    <nav className="w-full max-w-6xl bg-white/90 backdrop-blur-md shadow-md rounded-full mt-4 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="Kube-Netra" className="h-8 w-8 mr-2" />
        <span className="text-xl font-bold text-yellow-600">Kube-Netra</span>
        {pat?.nameOfPAT && (
          <span className="ml-4 text-lg font-medium text-gray-700">{pat.nameOfPAT}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/pats/${pat._id}/addProjectToPAT`)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-full transition"
        >
          <Plus size={16} /> Add Project to PAT
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 rounded-full transition"
        >
          <Trash2 size={16} /> Delete
        </button>

        <ProfileMenu />
      </div>
    </nav>
  );
};

export default PATPageNavbar;
