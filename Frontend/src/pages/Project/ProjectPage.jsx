import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEnvironments,
  fetchCurrentProjectDetails,
  startLogsSSE,
  stopSSE,
} from "../../features/projects/projectPageSlice";

import ProjectNavbar from "../../components/ProjectPageNavbar";
import ProjectStatusCard from "../../components/ProjectStatusCard";
import EnvironmentList from "../../components/EnvironmentList";
import LogsSection from "../../components/LogsSection";

const ProjectPage = () => {
  const dispatch = useDispatch();
  const { environments, loading, error } = useSelector((s) => s.projectPage);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchEnvironments());
      await dispatch(fetchCurrentProjectDetails());
    };
    fetchData();
  }, [dispatch]);

  // Start SSE on mount, stop on unmount
  useEffect(() => {
  const fetchData = async () => {
    await dispatch(fetchEnvironments());
    const res = await dispatch(fetchCurrentProjectDetails());

    if (res.payload?.isWorkflowTriggered) {
      dispatch(startLogsSSE()); // ✅ sirf tabhi SSE start
    }
  };
  fetchData();

  return () => dispatch(stopSSE());
}, [dispatch]);


  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: "url('/bg-red.jpg')" }}
    >
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full flex justify-center z-50">
        <ProjectNavbar
          projectName={
            environments && environments.length
              ? `<${environments[0].projectId}>`
              : "Project"
          }
        />
      </div>

      {/* Main wrapper */}
      <div className="flex-1 w-[90%] mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mt-24 mb-12 flex flex-col">
        <section className="py-10 px-6 md:px-16 flex-1 flex flex-col items-center">
          <div className="mb-8 w-full max-w-3xl">
            <ProjectStatusCard />
          </div>

          {loading && <p className="text-blue-600 text-center">Loading environments...</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {!loading && !error && (
            <div className="flex flex-col items-center w-full space-y-12">
              <EnvironmentList environments={environments}  />
              <LogsSection />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProjectPage;
