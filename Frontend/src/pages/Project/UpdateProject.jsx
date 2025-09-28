// src/pages/Project/UpdateProject.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProjectDetails, updateProject, resetProjectState } from "../../features/projects/projectOpSlice";

const UpdateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const { loading, error, details, success } = useSelector((state) => state.projectOp);

  const [form, setForm] = useState({
    name: "",
    dockerImage: "",
    poolInterval: 0,
    imageType: "public",
    dockerhubUsername: "",
    dockerhubPAT: "",
  });

  // fetch project details on mount
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectDetails(projectId));
    }
  }, [dispatch, projectId]);

  // auto-fill form when details loaded
  useEffect(() => {
    
    if (details) {
      const baseForm = {
        name: details.name || "",
        dockerImage: details.dockerImage || "",
        poolInterval: details.poolInterval || 0,
        imageType: details.imageType || "public",
      };

      // add DockerHub fields only if private
      if (details.imageType === "private") {
        baseForm.dockerhubUsername = details.dockerhubUsername || "";
        baseForm.dockerhubPAT = details.dockerhubPAT || "";
      }

      setForm(baseForm);
    }
  }, [details]);

  // redirect after success
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetProjectState());
        navigate("/projects");
      }, 800);
    }
  }, [success, dispatch, navigate]);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // dynamic DockerHub fields handling
    if (name === "imageType") {
      if (value === "private") {
        setForm({ ...form, imageType: value, dockerhubUsername: "", dockerhubPAT: "" });
      } else {
        const { dockerhubUsername, dockerhubPAT, ...rest } = form;
        setForm({ ...rest, imageType: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // prevent empty DockerHub fields if private
    if (form.imageType === "private" && (!form.dockerhubUsername || !form.dockerhubPAT)) {
      alert("Please fill DockerHub Username and PAT for private projects.");
      return;
    }

    dispatch(updateProject({ projectId, formData: form }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: "url('/bg-red.jpg')" }}>
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white/90 rounded-[3rem] shadow-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left */}
        <div className="flex flex-col items-center justify-center bg-[#f0f9ff] p-10">
          <img src="/logo.png" alt="Logo" className="w-40 h-40 mb-6" />
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-2xl font-bold text-gray-900">Update Project</h2>
          <p className="text-gray-600 text-sm mb-6">Edit project details</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Project Name"
              value={form.name} onChange={handleChange} required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

            <input type="text" name="dockerImage" placeholder="Docker Image"
              value={form.dockerImage} onChange={handleChange} required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

            <input type="number" name="poolInterval" placeholder="Pool Interval"
              value={form.poolInterval} onChange={handleChange} required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

            <select name="imageType" value={form.imageType} onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            {/* DockerHub fields only for private */}
            {form.imageType === "private" && (
              <>
                <input type="text" name="dockerhubUsername" placeholder="DockerHub Username"
                  value={form.dockerhubUsername} onChange={handleChange} required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />

                <input type="password" name="dockerhubPAT" placeholder="DockerHub PAT"
                  value={form.dockerhubPAT} onChange={handleChange} required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />
              </>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">Project updated successfully!</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? "Updating..." : "Update Project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;
