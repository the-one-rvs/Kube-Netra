import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { startManualPatcher } from "../features/projects/projectPageSlice"; // ✅ correct path

const colors = [
  "bg-red-200",
  "bg-green-200",
  "bg-blue-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
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
          className="text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition"
          title="Add Environment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Environment cards */}
      <div className="w-full max-w-3xl space-y-6">
        {environments.map((env, idx) => (
          <div
            key={env._id}
            className={`p-6 rounded-xl shadow-lg ${colors[idx % colors.length]} flex justify-between items-center`}
          >
            {/* Left: details */}
            <div>
              <h3 className="text-xl font-semibold">{env.environmentName}</h3>
              <p className="text-sm text-gray-700">Branch: {env.branch}</p>
              <p className="text-sm text-gray-700">Mode: {env.mode}</p>
              <p className="text-sm text-gray-700">
                Repo:{" "}
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

            {/* Right: actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/projects/environment/update/${env._id}`)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>

              <button
                onClick={() => navigate(`/projects/environment/delete/${env._id}`)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>

              {env.mode === "manual" && (
                <button
                  onClick={() => dispatch(startManualPatcher(env._id))}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Manual Patcher
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentList;
