import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProject, clearProjectState } from "../../features/projects/projectSlice";

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, project } = useSelector((state) => state.projects);

  const [form, setForm] = useState({
    name: "",
    dockerImage: "",
    poolInterval: "",
    imageType: "public",
    dockerhubPAT: "",
    dockerhubUsername: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...form };
    if (form.imageType !== "private") {
      delete payload.dockerhubPAT;
      delete payload.dockerhubUsername;
    }

    dispatch(createProject(payload));
  };

 useEffect(() => {
    if (project) {
      navigate("/projects");
      setTimeout(() => {
        dispatch(clearProjectState());
      }, 500); // thoda delay do
    }
  }, [project, navigate, dispatch]);


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
         style={{ backgroundImage: "url('/bg-red.jpg')" }}>
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white/90 rounded-[3rem] shadow-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left */}
        <div className="flex flex-col items-center justify-center bg-[#f0f9ff] p-10">
          <img src="/logo.png" alt="KubeNetra Logo" className="w-40 h-40 mb-6" />
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
          <p className="text-gray-600 text-sm mb-6">Fill in the project details</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Project Name"
              value={form.name} onChange={handleChange} required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

            <input type="text" name="dockerImage" placeholder="Docker Image"
              value={form.dockerImage} onChange={handleChange} required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

            <input type="number" name="poolInterval" placeholder="Pool Interval (sec)"
              value={form.poolInterval} onChange={handleChange} required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

            <select name="imageType" value={form.imageType} onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            {/* Show only if private */}
            {form.imageType === "private" && (
              <>
                <input type="text" name="dockerhubUsername" placeholder="DockerHub Username"
                  value={form.dockerhubUsername} onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

                <input type="password" name="dockerhubPAT" placeholder="DockerHub PAT"
                  value={form.dockerhubPAT} onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />
              </>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {project && <p className="text-green-600 text-sm">Project created successfully!</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
