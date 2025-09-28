// src/pages/AddPAT.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addGithubPAT, clearPATState } from "../../features/PAT/patSlice";
import { Eye, EyeOff } from "lucide-react";

const AddPAT = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, pat } = useSelector((state) => state.pat);

  const [showPAT, setShowPAT] = useState(false);

  const [form, setForm] = useState({
    nameOfPAT: "",
    githubUsername: "",
    githubPAT: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addGithubPAT(form));
  };

  useEffect(() => {
    if (pat) {
      navigate("/pats");
      setTimeout(() => {
        dispatch(clearPATState());
      }, 500);
    }
  }, [pat, navigate, dispatch]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-yellow.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white/90 rounded-[3rem] shadow-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left */}
        <div className="flex flex-col items-center justify-center bg-[#f0f9ff] p-10">
          <img src="/logo.png" alt="KubeNetra Logo" className="w-40 h-40 mb-6" />
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-2xl font-bold text-gray-900">Add GitHub PAT</h2>
          <p className="text-gray-600 text-sm mb-6">
            Fill in your GitHub Personal Access Token details
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="nameOfPAT"
              placeholder="Name of PAT"
              value={form.nameOfPAT}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="githubUsername"
              placeholder="GitHub Username"
              value={form.githubUsername}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            {/* PAT with Eye toggle */}
            <div className="relative">
              <input
                type={showPAT ? "text" : "password"}
                name="githubPAT"
                placeholder="GitHub PAT"
                value={form.githubPAT}
                onChange={handleChange}
                required
                className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPAT(!showPAT)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPAT ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {pat && <p className="text-green-600 text-sm">PAT added successfully!</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add PAT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPAT;
