import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEnvironment, clearEnvironmentState } from "../../features/environments/environmentSlice";

const CreateEnvironment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, environment } = useSelector((state) => state.environments);

  const [form, setForm] = useState({
    environmentName: "",
    gitRepo: "",
    helmValuePath: "",
    mode: "auto",
    branch: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createEnvironment(form));
  };

  useEffect(() => {
    if (environment) {
      navigate("/environments");
      setTimeout(() => {
        dispatch(clearEnvironmentState());
      }, 500);
    }
  }, [environment, navigate, dispatch]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-red.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white/90 rounded-[3rem] shadow-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Section */}
        <div className="flex flex-col items-center justify-center bg-[#f0f9ff] p-10">
          <img src="/logo.png" alt="KubeNetra Logo" className="w-40 h-40 mb-6" />
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-2xl font-bold text-gray-900">Create New Environment</h2>
          <p className="text-gray-600 text-sm mb-6">Fill in the environment details</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="environmentName"
              placeholder="Environment Name"
              value={form.environmentName}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="gitRepo"
              placeholder="Git Repository URL"
              value={form.gitRepo}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="helmValuePath"
              placeholder="Helm Values Path"
              value={form.helmValuePath}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="branch"
              placeholder="Git Branch"
              value={form.branch}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
            </select>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {environment && <p className="text-green-600 text-sm">Environment created successfully!</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Environment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEnvironment;
