import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

const LogsSection = () => {
  const { watcherLogs, workflowLogs, patcherLogs, environments, isWorkflowRunning } =
    useSelector((state) => state.projectPage);

  const [activeTab, setActiveTab] = useState("watcher");

  const watcherLogRef = useRef(null);
  const workflowLogRef = useRef(null);
  const patcherLogRefs = useRef({});

  useEffect(() => {
    if (watcherLogRef.current)
      watcherLogRef.current.scrollTop = watcherLogRef.current.scrollHeight;
    if (workflowLogRef.current)
      workflowLogRef.current.scrollTop = workflowLogRef.current.scrollHeight;
    Object.keys(patcherLogRefs.current).forEach((envId) => {
      const ref = patcherLogRefs.current[envId];
      if (ref) ref.scrollTop = ref.scrollHeight;
    });
  }, [watcherLogs, workflowLogs, patcherLogs]);

  const tabs = [
    { key: "watcher", label: "Watcher Logs" },
    { key: "workflow", label: "Workflow Logs" },
    ...environments.map((env) => ({ key: `patcher-${env._id}`, label: `Patcher – ${env.environmentName}` })),
  ];

  return (
    <div className="mt-6 w-full max-w-3xl">
      {!isWorkflowRunning && (
        <div className="text-center text-gray-600 italic mb-4">
          Logs will appear here when the project is running...
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Project Logs</h2>

      {/* Tabs */}
      <div className="flex border-b mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Log View */}
      <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
        {activeTab === "watcher" && (
          <pre
            ref={watcherLogRef}
            className="text-xs overflow-y-auto max-h-96 font-mono"
          >
            {watcherLogs.length ? watcherLogs.join("\n") : "No watcher logs yet..."}
          </pre>
        )}

        {activeTab === "workflow" && (
          <pre
            ref={workflowLogRef}
            className="text-xs overflow-y-auto max-h-96 font-mono"
          >
            {workflowLogs.length ? workflowLogs.join("\n") : "No workflow logs yet..."}
          </pre>
        )}

        {environments.map((env) =>
          activeTab === `patcher-${env._id}` ? (
            <pre
              key={env._id}
              ref={(el) => (patcherLogRefs.current[env._id] = el)}
              className="text-xs overflow-y-auto max-h-96 font-mono"
            >
              {(patcherLogs[env._id] || []).length
                ? patcherLogs[env._id].join("\n")
                : "No patcher logs yet..."}
            </pre>
          ) : null
        )}
      </div>
    </div>
  );
};

export default LogsSection;
