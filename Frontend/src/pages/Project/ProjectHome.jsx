import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, alterFavorite, fetchCurrentProject } from "../../features/projects/projectSlice";
import ProjectNavbar from "../../components/ProjectNavbar";
import ProjectCard from "../../components/ProjectCard";
import { Plus } from "lucide-react";

const ProjectsHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: projects, loading, error } = useSelector(
    (state) => state.projects
  );

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchCurrentProject());

    const saved = localStorage.getItem("searchTerm");
    if (saved) {
      setSearchTerm(saved);
    }
  }, [dispatch]);


  // ❤️ Toggle favorites (with reload)
  const toggleFavorite = (id) => {
    dispatch(alterFavorite(id)).then(() => {
      window.location.reload();
    });
  };

  // 🗑️ Delete handler (backend integration pending)
  const handleDelete = (id) => {
    alert("Delete project: " + id);
    // dispatch(deleteProject(id)) etc...
  };

  // ✏️ Update handler
  const handleUpdate = (id) => {
    navigate(`/projects/update/${id}`);
  };

  const favoriteProjects = projects.filter((p) => p.isfaviorate);
  const normalProjects = projects.filter((p) => !p.isfaviorate);

  const searchedFavorites = favoriteProjects.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchedNormals = normalProjects.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    navigate("/projects/createProject");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: "url('/bg-red.jpg')" }}
    >
      <div className="fixed top-0 left-0 w-full flex justify-center z-50">
        <ProjectNavbar onSearch={setSearchTerm} />
      </div>

      <div className="flex-1 w-[90%] mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mt-24 mb-12">
        <section className="py-12 px-6 md:px-16">
          <h2 className="text-3xl font-bold text-center mb-2">PROJECTS</h2>
          <p className="text-center text-gray-600 mb-10">
            Here are your team’s projects. Click a project to proceed, or add a new one.
          </p>

          {loading && <p className="text-center text-blue-600 font-medium">Loading projects...</p>}
          {error && <p className="text-center text-red-600 font-medium">{error}</p>}

          {!loading && !error && (
            <>
              {/* ⭐ Favorite Projects */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">⭐ Favorite Projects</h3>
                {searchedFavorites.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {searchedFavorites.map((project) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        toggleFavorite={toggleFavorite}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No favorites match your search.</p>
                )}
              </div>

              {/* 📂 All Projects */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">📂 Other Projects</h3>
                {searchedNormals.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {searchedNormals.map((project) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        toggleFavorite={toggleFavorite}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No other projects found for your search.</p>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {/* ➕ Floating Add Button */}
      <button
        onClick={handleAdd}
        className="fixed bottom-10 right-10 bg-blue-500 hover:bg-red-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default ProjectsHome;
