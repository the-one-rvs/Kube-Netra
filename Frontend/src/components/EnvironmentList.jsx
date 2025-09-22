// src/components/EnvironmentList.jsx
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startManualPatcher } from "../features/projects/projectPageSlice";
import { deleteEnvironment } from "../features/environments/environmentSlice";  // ✅ import
import { useState, useEffect } from "react";
import axios from "axios";

const colors = [
  "bg-red-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
];

const EnvironmentList = ({ environments = [], onDeleteSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.environments); // ✅ read state
  

  if (!environments || environments.length === 0) {
    return <p className="text-gray-500 text-center">No environments found.</p>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Heading + Add button */}
      <div className="flex items-center justify-between w-full max-w-3xl mb-6">
        <h2 className="text-2xl font-bold">Environments</h2>
        <button
          onClick={() => navigate("/projects/environment/addEnvironment")}
          className="text-white bg-red-400 rounded-full px-4 py-2 hover:bg-red-700 transition"
          title="Add Environment"
        >
          ➕ Add
        </button>
      </div>

      {/* Vertical scrollable list */}
      <div className="w-full max-w-3xl max-h-[70vh] overflow-y-auto space-y-6 pr-2">
        {environments.map((env, idx) => (
          <EnvironmentCard
            key={env._id}
            env={env}
            color={colors[idx % colors.length]}
            dispatch={dispatch}
            navigate={navigate}
            loading={loading}
            onDeleteSuccess={onDeleteSuccess}
          />
        ))}
      </div>

      {/* Feedback */}
      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      {success && <p className="text-green-600 text-sm mt-4">Environment deleted! Please reload</p>}
    </div>
  );
};

const EnvironmentCard = ({ env, color, dispatch, navigate, loading, onDeleteSuccess }) => {
  const [tag, setTag] = useState(null);
  const [polling, setPolling] = useState(true);
  

  // Polling for current image tag
  useEffect(() => {
    if (!polling) return;

    const fetchTag = async () => {
      try {
        const res = await axios.get(
          `/api/v1/callCore/getImageTagForEnvironment/${env._id}`,
          { withCredentials: true }
        );
        const json = res.data;
        if (json.success && json.data?.imageTag) setTag(json.data.imageTag);
        if (json.data?.workflowStatus === "stopped") setPolling(false);
      } catch (err) {
        console.error("Polling failed:", err);
      }
    };

    fetchTag();
    const interval = setInterval(fetchTag, 5000);
    return () => clearInterval(interval);
  }, [polling, env._id]);

  const handleManualPatcher = () => {
    dispatch(startManualPatcher(env._id));
    setPolling(true);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this environment?")) {
      const res = await dispatch(deleteEnvironment(env._id));
      if (res.meta.requestStatus === "fulfilled" && onDeleteSuccess) {
        onDeleteSuccess(env._id); // ✅ remove from list in parent
      }
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-xl ${color} flex flex-col relative transition hover:scale-[1.01]`}
    >
      {/* Top-right: tag box */}
      <div className="absolute top-4 right-4">
        <div className="bg-white text-black px-2 py-1 rounded-md border shadow-sm min-w-[90px] text-center">
          {polling && !tag ? (
            <span className="text-gray-500 animate-pulse">⏳ Fetching...</span>
          ) : tag ? (
            <>
              <span className="font-semibold">Tag:</span>{" "}
              <span className="text-green-600 font-mono">{tag}</span>
            </>
          ) : (
            <span className="text-gray-400">No tag</span>
          )}
        </div>
      </div>

      {/* Card details */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {env.environmentName}
        </h3>
        <p className="text-sm text-gray-700">🌿 Branch: {env.branch}</p>
        <p className="text-sm text-gray-700">⚙️ Mode: {env.mode}</p>
        <p className="text-sm text-gray-700">
          📂 Repo:{" "}
          <a
            href={env.gitRepo}
            target="_blank"
            rel="noreferrer"
            className="underline text-blue-700"
          >
            View
          </a>
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        {env.mode === "manual" && (
          <button
            onClick={handleManualPatcher}
            className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-400"
          >
            ⚡ Manual Patcher
          </button>
        )}

        <button
          onClick={() =>
            navigate(
              `/projects/${env.projectId}/environment/${env.environmentNumber}/edit/${env._id}`
            )
          }
          className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-400"
        >
          ✏️ Update
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-700 text-white rounded-md text-sm font-medium hover:bg-red-400 disabled:opacity-50"
        >
          {loading ? "Deleting..." : "🗑️ Delete"}
        </button>
      </div>
    </div>
  );
};

export default EnvironmentList;
