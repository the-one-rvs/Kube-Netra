import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPAT } from "../../features/PAT/patSlice";
import PATNavbar from "../../components/PATNavbar";
import PATCard from "../../components/PATCard";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PATHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: pats, loading, error } = useSelector((state) => state.pat);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllPAT());

    const saved = localStorage.getItem("patSearchTerm");
    if (saved) {
      setSearchTerm(saved);
    }
  }, [dispatch]);

  const handleAdd = () => {
    navigate("/pats/addPat");
  };

  // ✅ fix: use nameOfPAT (from API) instead of name
  const searchedPATs = pats.filter((p) =>
    p.nameOfPAT?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: "url('/bg-yellow.jpg')" }}
    >
      <div className="fixed top-0 left-0 w-full flex justify-center z-50">
        <PATNavbar onSearch={setSearchTerm} />
      </div>

      <div className="flex-1 w-[90%] mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mt-24 mb-12">
        <section className="py-12 px-6 md:px-16">
          <h2 className="text-3xl font-bold text-center mb-2">GitHub PATs</h2>
          <p className="text-center text-gray-600 mb-10">
            Manage your GitHub Personal Access Tokens (PAT). Click on a token to view details.
          </p>

          {loading && (
            <p className="text-center text-blue-600 font-medium">
              Loading PATs...
            </p>
          )}
          {error && (
            <p className="text-center text-red-600 font-medium">{error}</p>
          )}

          {!loading && !error && (
            <>
              {searchedPATs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {searchedPATs.map((pat) => (
                    <PATCard key={pat._id} pat={pat} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No PATs match your search.
                </p>
              )}
            </>
          )}
        </section>
      </div>

      <button
        onClick={handleAdd}
        className="fixed bottom-10 right-10 bg-yellow-500 hover:bg-yellow-400 text-black w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
      >
        <Plus size={28} />
      </button>

    </div>
  );
};

export default PATHome;
