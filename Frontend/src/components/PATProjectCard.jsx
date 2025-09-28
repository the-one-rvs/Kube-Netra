// src/components/PATProjectCard.jsx
import { useDispatch } from "react-redux";
import { Minus } from "lucide-react";
import { removeProjectFromPAT } from "../features/PAT/patPageSlice";

const PATProjectCard = ({ project, patId }) => {
  const dispatch = useDispatch();

  const handleRemove = async () => {
    try {
      await dispatch(removeProjectFromPAT({ patId, projectId: project._id })).unwrap();
    } catch (err) {
      console.error("❌ Failed to remove project:", err);
    }
  };

  return (
    <div className="relative group p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition">
      {/* Remove Button (hidden until hover) */}
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
        title="Remove from PAT"
      >
        <Minus size={14} />
      </button>

      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {project.name || "Unnamed Project"}
      </h3>
      <p className="text-gray-600 text-sm">
        Docker Image: {project.dockerImage || "N/A"}
      </p>
      <p className="text-gray-600 text-sm">
        Pool Interval: {project.poolInterval || "N/A"} sec
      </p>
    </div>
  );
};

export default PATProjectCard;
