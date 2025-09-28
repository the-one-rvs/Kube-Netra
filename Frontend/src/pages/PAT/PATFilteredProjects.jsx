import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredProjects, fetchPATDetails } from "../../features/PAT/patPageSlice";
import PATFilteredProjectCard from "../../components/PATFilteredProjectCard";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PATFilteredProjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patId } = useParams();
  const { pat, filteredProjects, loading, error } = useSelector((state) => state.patPage);

  useEffect(() => {
    dispatch(fetchPATDetails(patId));
    dispatch(fetchFilteredProjects());
  }, [dispatch, patId]);

  if (loading) return <p className="text-center text-blue-600 mt-20">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-20">{error}</p>;
  if (!filteredProjects || filteredProjects.length === 0) return <p className="text-center mt-20">No available projects</p>;

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg-yellow.jpg')" }}
    >
      {/* Card Container */}
      <div className="flex-1 w-[90%] max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mt-8 mb-12 py-12 px-6 md:px-12 flex flex-col items-center gap-6">
        
        {/* Back Button */}
        <div className="w-full flex items-center mb-6">
          <button
            onClick={() => navigate(`/pats/${patId}`)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">
          Add Project to <span className="text-yellow-600">{pat?.nameOfPAT}</span>
        </h2>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {filteredProjects.map((proj) => (
            <PATFilteredProjectCard
              key={proj._id}
              project={proj}
              patName={pat?.nameOfPAT}
              patId={patId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PATFilteredProjects;
