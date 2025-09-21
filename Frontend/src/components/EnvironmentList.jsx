import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { startManualPatcher } from "../features/projects/projectPageSlice";
import { MoreVertical } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const colors = [
  "bg-red-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
];

const EnvironmentList = ({ environments = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          className="text-white bg-white-600 rounded-full p-2 hover:bg-red-300 transition"
          title="Add Environment"
        >
          ➕
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
          />
        ))}
      </div>
    </div>
  );
};

const EnvironmentCard = ({ env, color, dispatch, navigate }) => {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState(null);
  const [polling, setPolling] = useState(true);
  const dropdownRef = useRef(null);

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

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleManualPatcher = () => {
    dispatch(startManualPatcher(env._id));
    setPolling(true);
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-xl ${color} flex flex-col relative transition hover:scale-[1.01]`}
    >
      {/* Top-right corner: tag + patcher + dropdown */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        {/* Tag box */}
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

        {/* Manual Patcher button */}
        {env.mode === "manual" && (
          <button
            onClick={handleManualPatcher}
            className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium hover:bg-green-200"
          >
            ⚡ Manual Patcher
          </button>
        )}

        {/* 3-dot dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-full hover:bg-gray-200 mt-2"
          >
            <MoreVertical size={20} />
          </button>

          {open && (
            <div className="absolute right-0 -top-24 w-44 bg-white shadow-md rounded-md z-50">
              <button
                onClick={() => navigate(`/projects/environment/update/${env._id}`)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
              >
                ✏️ Update
              </button>
              <button
                onClick={() => navigate(`/projects/environment/delete/${env._id}`)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-red-100"
              >
                🗑️ Delete
              </button>
            </div>
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
    </div>
  );
};

export default EnvironmentList;
