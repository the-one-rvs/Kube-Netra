// src/components/ProjectStatusCard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startWorkflow,
  stopWorkflow,
  fetchEnvironments,
  startLogsSSE,
  stopSSE,
} from "../features/projects/projectPageSlice";
import { fetchCurrentProject } from "../features/projects/projectSlice";

const ProjectStatusCard = () => {
  const dispatch = useDispatch();
  const { currentProject } = useSelector((s) => s.projects);

  // derive running state from API response
  const isWorkflowRunning = currentProject?.isWorkflowTriggered ?? false;

  // on mount -> fetch project details + envs
  useEffect(() => {
    dispatch(fetchCurrentProject());
    dispatch(fetchEnvironments());
  }, [dispatch]);

  // handle run project
  const handleRun = async () => {
    await dispatch(startWorkflow());
    dispatch(fetchCurrentProject()); // refresh status
    dispatch(startLogsSSE()); // start streaming logs
  };

  // handle stop project
  const handleStop = async () => {
    await dispatch(stopWorkflow());
    dispatch(fetchCurrentProject()); // refresh status
    dispatch(stopSSE()); // stop streams
  };

  return (
    <div className="flex gap-4 items-center mt-4">
      {/* Run Button */}
      <button
        onClick={handleRun}
        disabled={isWorkflowRunning}
        className={`px-4 py-2 rounded shadow ${
          isWorkflowRunning
            ? "bg-purple-300 text-white cursor-not-allowed"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        Run Project
      </button>

      {/* Stop Button */}
      <button
        onClick={handleStop}
        disabled={!isWorkflowRunning}
        className={`px-4 py-2 rounded shadow ${
          !isWorkflowRunning
            ? "bg-gray-400 text-black cursor-not-allowed"
            : "bg-gray-700 text-white hover:bg-gray-800"
        }`}
      >
        Stop Project
      </button>

      {/* Status Badge */}
      <span
        className={`px-3 py-1 rounded-md text-sm font-semibold ${
          isWorkflowRunning ? "bg-green-500 text-white" : "bg-red-400 text-white"
        }`}
      >
        {isWorkflowRunning ? "Running" : "Not Running"}
      </span>
    </div>
  );
};

export default ProjectStatusCard;
