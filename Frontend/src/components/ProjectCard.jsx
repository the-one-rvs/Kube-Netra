import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { enterProject } from "../features/projects/projectSlice";

const ProjectCard = ({ project, toggleFavorite }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.projects);

  const isWorkflowRunning = project.isWorkflowTriggered;

  const isCurrentProject =
    currentProject && currentProject._id === project._id;

  // Decide if button is clickable
  const canEnter =
    !currentProject || (currentProject && isCurrentProject);

  const handleEnterProject = async () => {
    if (!canEnter) return;
    await dispatch(enterProject(project._id));
    navigate(`/projects/${project._id}`);
  };

  return (
    <div className="rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-2xl transition relative">
      {/* 🔹 Top status boxes */}
      <div className="absolute top-2 left-2 flex gap-2">
        {/* Workflow status */}
        <div className="bg-white px-3 py-1 rounded-md shadow flex items-center gap-2 text-sm">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isWorkflowRunning ? "led-red" : "bg-black"
            }`}
          ></span>
          <span
            className={`${
              isWorkflowRunning ? "text-red-600" : "text-black"
            } font-medium`}
          >
            {isWorkflowRunning ? "Running" : "Not Running"}
          </span>
        </div>

        {/* Current Project Box */}
        {isCurrentProject && (
          <div className="bg-white px-3 py-1 rounded-md shadow flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full led-green"></span>
            <span className="text-green-600 font-medium">Current Project</span>
          </div>
        )}
      </div>

      {/* Project header color block */}
      <div
        className={`${
          project.color || "bg-purple-300"
        } h-32 w-full flex items-center justify-center text-5xl`}
      >
        ֎
      </div>

      {/* Name + Favorite */}
      <div className="p-4 flex justify-between items-center relative">
        <span className="font-medium text-gray-800">{project.name}</span>
        <Heart
          size={20}
          onClick={() => toggleFavorite(project._id)}
          className={`cursor-pointer transition ${
            project.isfaviorate
              ? "text-red-500 fill-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </div>

      {/* Go Inside Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleEnterProject}
          disabled={!canEnter}
          className={`text-purple-600 font-semibold hover:underline ${
            !canEnter ? "opacity-50 cursor-not-allowed hover:underline-none" : ""
          }`}
        >
          GO INSIDE
        </button>
      </div>

      {/* 🔹 LED blink CSS */}
      <style>
        {`
          @keyframes ledBlinkRed {
            0%, 100% { opacity: 1; box-shadow: 0 0 4px rgba(255,0,0,0.7); }
            50% { opacity: 0.3; box-shadow: 0 0 12px rgba(255,0,0,1); }
          }
          .led-red {
            background-color: #f87171;
            animation: ledBlinkRed 0.6s infinite;
          }

          @keyframes ledBlinkGreen {
            0%, 100% { opacity: 1; box-shadow: 0 0 4px rgba(0,255,0,0.7); }
            50% { opacity: 0.3; box-shadow: 0 0 12px rgba(0,255,0,1); }
          }
          .led-green {
            background-color: #22c55e;
            animation: ledBlinkGreen 0.6s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default ProjectCard;
