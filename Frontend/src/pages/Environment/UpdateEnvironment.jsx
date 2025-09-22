// src/pages/Environment/UpdateEnvironment.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchEnvironmentDetails,
  updateEnvironment,
  resetEnvironmentState,
} from "../../features/environments/environmentSlice";

const UpdateEnvironment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId, environmentNumber, environmentId } = useParams();

  const { loading, error, details, success } = useSelector(
    (state) => state.environments
  );

  const [form, setForm] = useState({
    environmentName: "",
    gitRepo: "",
    helmValuePath: "",
    mode: "auto",
    branch: "",
  });

  // fetch details on mount
  useEffect(() => {
    if (projectId && environmentNumber && environmentId) {
      dispatch(
        fetchEnvironmentDetails({ projectId, environmentNumber, environmentId })
      );
    }
  }, [dispatch, projectId, environmentNumber, environmentId]);

  // auto-fill
  useEffect(() => {
    console.log("details", details);
    if (details) {
      setForm({
        environmentName: details.environmentName || "",
        gitRepo: details.gitRepo || "",
        helmValuePath: details.helmValuePath || "",
        mode: details.mode || "auto",
        branch: details.branch || "",
      });
    }
  }, [details]);

  // redirect after success
  useEffect(() => {
    if (success) {
      // ✅ show success and redirect
      setTimeout(() => {
        dispatch(resetEnvironmentState());
        navigate(`/projects/${projectId}`);
      }, 800);
    }
  }, [success, dispatch, navigate, projectId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEnvironment({ environmentId, formData: form }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-red.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white/90 rounded-[3rem] shadow-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left */}
        <div className="flex flex-col items-center justify-center bg-[#f0f9ff] p-10">
          <img src="/logo.png" alt="KubeNetra Logo" className="w-40 h-40 mb-6" />
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-2xl font-bold text-gray-900">Update Environment</h2>
          <p className="text-gray-600 text-sm mb-6">Edit environment details</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="environmentName" placeholder="Environment Name"
              value={form.environmentName} onChange={handleChange} required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

            <input type="text" name="gitRepo" placeholder="Git Repository URL"
              value={form.gitRepo} onChange={handleChange} required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

            <input type="text" name="helmValuePath" placeholder="Helm Values Path"
              value={form.helmValuePath} onChange={handleChange} required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

            <input type="text" name="branch" placeholder="Git Branch"
              value={form.branch} onChange={handleChange} required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

            <select name="mode" value={form.mode} onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500">
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
            </select>

            {/* messages */}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">Environment updated successfully!</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? "Updating..." : "Update Environment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateEnvironment;
