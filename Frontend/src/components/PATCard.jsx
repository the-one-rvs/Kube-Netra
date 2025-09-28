import { Key } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PATCard = ({ pat }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition">
      <Key size={40} className="text-black mb-4" />
      
      {/* ✅ API me 'nameOfPAT' hai, 'name' nahi */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        {pat.nameOfPAT}
      </h3>

      <button
        onClick={() => navigate(`/pats/${pat._id}`)}
        className="px-4 py-2 bg-yellow-200 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-md transition"
      >
        Click Here
      </button>
    </div>
  );
};

export default PATCard;
