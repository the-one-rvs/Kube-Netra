// src/pages/PATPage.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPATDetails, clearPATDetails } from "../../features/PAT/patPageSlice";
import PATPageNavbar from "../../components/PATPageNavbar";
import PATProjectCard from "../../components/PATProjectCard";

const PATPage = () => {
  const { patId } = useParams();
  const dispatch = useDispatch();
  const { pat, loading, error } = useSelector((state) => state.patPage);

  useEffect(() => {
    if (patId) dispatch(fetchPATDetails(patId));
    return () => dispatch(clearPATDetails());
  }, [patId, dispatch]);

  if (loading) return <p className="text-center text-blue-600 mt-20">Loading PAT...</p>;
  if (error) return <p className="text-center text-red-600 mt-20">{error}</p>;
  if (!pat) return null;

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center" style={{ backgroundImage: "url('/bg-yellow.jpg')" }}>
      <PATPageNavbar />

      <div className="flex-1 w-[90%] mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mt-10 mb-12 py-12 px-6 md:px-12">
        {/* PAT Showcase */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">{pat.nameOfPAT}</h1>
          <div className="mt-4 inline-block px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium">
            {pat.githubUsername}
          </div>
        </div>

        {/* Projects */}
        <h2 className="text-2xl font-semibold mb-6">Associated Projects</h2>
        {pat.projects && pat.projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pat.projects.map((proj) => (
              <PATProjectCard key={proj._id} project={proj} patId={pat._id} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No projects associated with this PAT.</p>
        )}

      </div>
    </div>
  );
};

export default PATPage;
