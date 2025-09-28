// src/pages/ModifyPermissionsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDetails,
  fetchPermissions,
  fetchUserPermissions,
  addUserPermission,
  addUserProjectPermission,
  addUserPatPermission,
  removeUserPermission,
  removeUserProjectPermission,
  removeUserPatPermission,
} from "../../features/user/teamSlice";
import { fetchProjects } from "../../features/projects/projectSlice";
import { fetchAllPAT } from "../../features/PAT/patSlice";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ModifyPermissionsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    userDetails,
    userDetailsLoading,
    permissions,
    permissionsLoading,
    userPermissions,
    userPermissionsLoading,
    permissionActionLoading,
  } = useSelector((state) => state.team);

  const { items: projects } = useSelector((state) => state.projects);
  const { items: pats } = useSelector((state) => state.pat);

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [selectedPat, setSelectedPat] = useState("");
  const [selectedPatType, setSelectedPatType] = useState("");
  const [removeOpen, setRemoveOpen] = useState(false);

  // emoji avatar
  const emojiList = ["👨‍💻", "👩‍💻", "🧑‍🚀", "🧑‍🎨", "👮‍♂️", "🧑‍🔧", "🧑‍🏫", "🧑‍⚕️"];
  const emoji =
    userDetails?.username && userDetails.username.length > 0
      ? emojiList[userDetails.username.charCodeAt(0) % emojiList.length]
      : "👤";

  // fetch data
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetails(userId));
      dispatch(fetchPermissions());
      dispatch(fetchProjects());
      dispatch(fetchAllPAT());
      dispatch(fetchUserPermissions(userId));
    }
  }, [dispatch, userId]);

  // ===== Add Handlers =====
  const handleAddUserPermission = async () => {
    if (selectedPermissions.length === 0) return;
    await dispatch(addUserPermission({ userId, newPermissions: selectedPermissions }));
    dispatch(fetchUserPermissions(userId));
    setSelectedPermissions([]);
  };

  const handleAddProjectPermission = async () => {
    if (!selectedProject || !selectedProjectType) return;
    await dispatch(
      addUserProjectPermission({ userId, projectName: selectedProject, type: selectedProjectType })
    );
    dispatch(fetchUserPermissions(userId));
    setSelectedProject("");
    setSelectedProjectType("");
  };

  const handleAddPatPermission = async () => {
    if (!selectedPat || !selectedPatType) return;
    await dispatch(addUserPatPermission({ userId, patName: selectedPat, type: selectedPatType }));
    dispatch(fetchUserPermissions(userId));
    setSelectedPat("");
    setSelectedPatType("");
  };

  // ===== Remove Handlers =====
  const handleRemoveUserPermission = async (perm) => {
    await dispatch(removeUserPermission({ userId, permissionsToRemove: [perm] }));
    dispatch(fetchUserPermissions(userId));
  };

  const handleRemoveProjectPermission = async (projectName, type) => {
    await dispatch(removeUserProjectPermission({ userId, projectName, type }));
    dispatch(fetchUserPermissions(userId));
  };

  const handleRemovePatPermission = async (patName, type) => {
    await dispatch(removeUserPatPermission({ userId, patName, type }));
    dispatch(fetchUserPermissions(userId));
  };

  if (userDetailsLoading || permissionsLoading || userPermissionsLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  // safe defaults
  const safeUserPermissions = {
    global: userPermissions?.global ?? [],
    project: userPermissions?.project ?? [],
    pat: userPermissions?.pat ?? [],
  };

  // available global permissions
  const availablePermissions = (permissions ?? []).filter(
    (p) => !safeUserPermissions.global.includes(p)
  );

  // project permissions filtering
  const filteredProjects = (projects ?? []).filter((pr) => {
    const assigned = safeUserPermissions.project
      .filter((pp) => pp.projectName === pr.name)
      .map((pp) => pp.type);
    return assigned.length < 4;
  });

  const availableProjectTypes = (projectName) => {
    const assigned = safeUserPermissions.project
      .filter((pp) => pp.projectName === projectName)
      .map((pp) => pp.type);
    return ["show", "edit", "workflow", "delete"].filter((t) => !assigned.includes(t));
  };

  // PAT permissions filtering
  const filteredPATs = (pats ?? []).filter((pat) => {
    const assigned = safeUserPermissions.pat
      .filter((pp) => pp.patName === pat.nameOfPAT)
      .map((pp) => pp.type);
    return assigned.length < 5;
  });

  const availablePatTypes = (patName) => {
    const assigned = safeUserPermissions.pat
      .filter((pp) => pp.patName === patName)
      .map((pp) => pp.type);
    return ["create", "show", "delete", "addPATInProject", "removePATFromProject"].filter(
      (t) => !assigned.includes(t)
    );
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-green.png')" }}
      />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-3xl mx-auto z-10 py-8 px-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Back
          </button>

          {userDetails && (
            <div className="text-center">
              <div className="text-6xl mb-2">{emoji}</div>
              <h2 className="text-2xl font-semibold">{userDetails.fullname}</h2>
              <p className="text-gray-500">@{userDetails.username}</p>
            </div>
          )}

          {/* show existing permissions */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-1">Existing Permissions:</h3>
            <div className="mb-2">
              <strong>Global:</strong>{" "}
              {safeUserPermissions.global.length > 0
                ? safeUserPermissions.global.join(", ")
                : "None"}
            </div>
            <div className="mb-2">
              <strong>Project:</strong>{" "}
              {safeUserPermissions.project.length > 0
                ? safeUserPermissions.project.map((p) => `${p.projectName}:${p.type}`).join(", ")
                : "None"}
            </div>
            <div className="mb-2">
              <strong>PAT:</strong>{" "}
              {safeUserPermissions.pat.length > 0
                ? safeUserPermissions.pat.map((p) => `${p.patName}:${p.type}`).join(", ")
                : "None"}
            </div>
          </div>

          {/* ===== Add Permissions Sections ===== */}
          {/* Global */}
          <div>
            <h3 className="font-semibold text-green-700 mb-2">➕ Add User Permissions</h3>
            <select
              multiple
              value={selectedPermissions}
              onChange={(e) =>
                setSelectedPermissions([...e.target.selectedOptions].map((o) => o.value))
              }
              className="w-full border p-2 rounded mb-3"
            >
              {availablePermissions.length === 0 ? (
                <option disabled>All permissions assigned</option>
              ) : (
                availablePermissions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))
              )}
            </select>
            <button
              onClick={handleAddUserPermission}
              disabled={permissionActionLoading || selectedPermissions.length === 0}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Permission
            </button>
          </div>

          {/* Project */}
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">➕ Add Project Permissions</h3>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            >
              <option value="">Select Project</option>
              {filteredProjects.map((pr) => (
                <option key={pr._id} value={pr.name}>
                  {pr.name}
                </option>
              ))}
            </select>
            {selectedProject && (
              <select
                value={selectedProjectType}
                onChange={(e) => setSelectedProjectType(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              >
                <option value="">Select Type</option>
                {availableProjectTypes(selectedProject).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={handleAddProjectPermission}
              disabled={permissionActionLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Project Permission
            </button>
          </div>

          {/* PAT */}
          <div>
            <h3 className="font-semibold text-purple-700 mb-2">➕ Add PAT Permissions</h3>
            <select
              value={selectedPat}
              onChange={(e) => setSelectedPat(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            >
              <option value="">Select PAT</option>
              {filteredPATs.map((pat) => (
                <option key={pat._id} value={pat.nameOfPAT}>
                  {pat.nameOfPAT}
                </option>
              ))}
            </select>
            {selectedPat && (
              <select
                value={selectedPatType}
                onChange={(e) => setSelectedPatType(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              >
                <option value="">Select Type</option>
                {availablePatTypes(selectedPat).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={handleAddPatPermission}
              disabled={permissionActionLoading}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Add PAT Permission
            </button>
          </div>

          {/* ===== Remove Permissions Section ===== */}
          <div className="mt-6">
            <button
              onClick={() => setRemoveOpen(!removeOpen)}
              className="flex items-center justify-between w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <span className="font-semibold text-red-700">➖ Remove Permissions</span>
              {removeOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {removeOpen && (
              <div className="mt-3 p-4 bg-gray-100 rounded-lg space-y-3">
                {/* Global */}
                <div>
                  <h4 className="font-semibold mb-1">Global:</h4>
                  <div className="flex flex-wrap gap-2">
                    {safeUserPermissions.global.length > 0 ? (
                      safeUserPermissions.global.map((perm) => (
                        <div
                          key={perm}
                          className="flex items-center bg-gray-300 text-gray-800 px-2 py-1 rounded-full space-x-1"
                        >
                          <span>{perm}</span>
                          <button
                            onClick={() => handleRemoveUserPermission(perm)}
                            className="text-red-500 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </div>
                </div>

                {/* Project */}
                <div>
                  <h4 className="font-semibold mb-1">Project:</h4>
                  <div className="flex flex-wrap gap-2">
                    {safeUserPermissions.project.length > 0 ? (
                      safeUserPermissions.project.map((p) => (
                        <div
                          key={`${p.projectName}:${p.type}`}
                          className="flex items-center bg-gray-300 text-gray-800 px-2 py-1 rounded-full space-x-1"
                        >
                          <span>{`${p.projectName}:${p.type}`}</span>
                          <button
                            onClick={() => handleRemoveProjectPermission(p.projectName, p.type)}
                            className="text-red-500 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </div>
                </div>

                {/* PAT */}
                <div>
                  <h4 className="font-semibold mb-1">PAT:</h4>
                  <div className="flex flex-wrap gap-2">
                    {safeUserPermissions.pat.length > 0 ? (
                      safeUserPermissions.pat.map((p) => (
                        <div
                          key={`${p.patName}:${p.type}`}
                          className="flex items-center bg-gray-300 text-gray-800 px-2 py-1 rounded-full space-x-1"
                        >
                          <span>{`${p.patName}:${p.type}`}</span>
                          <button
                            onClick={() => handleRemovePatPermission(p.patName, p.type)}
                            className="text-red-500 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyPermissionsPage;
