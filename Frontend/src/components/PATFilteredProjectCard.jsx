// src/components/PATProjectCard.jsx
import { useDispatch } from "react-redux";
import { addPATinProject, fetchPATDetails } from "../features/PAT/patPageSlice";
import { Key } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PATFilteredProjectCard = ({ project, patName, patId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      await dispatch(addPATinProject({ projectId: project._id, nameOfPAT: patName })).unwrap();
      // after adding, redirect to pats/:patId
      navigate(`/pats/${patId}`);
    } catch (err) {
      console.error("Add PAT to project failed:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition">
      <Key size={36} className="text-yellow-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name || "Unnamed Project"}</h3>
      <p className="text-gray-600 text-sm mb-4">Docker Image: {project.dockerImage || "N/A"}</p>
      <button
        onClick={handleAdd}
        className="mt-auto px-4 py-2 bg-yellow-200 hover:bg-yellow-400 text-black font-semibold rounded-lg shadow-md transition"
      >
        Add
      </button>
    </div>
  );
};

export default PATFilteredProjectCard;
