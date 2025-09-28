// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterAdmin from "../pages/Auth/RegisterAdmin";
import Login from "../pages/Auth/Login";
import Home from "../pages/Home/Home";
// import { Edit } from "lucide-react";
import EditProfile from "../pages/User/EditProfile";
import ChangePassword from "../pages/User/ChangePassword";
import Landing from "../pages/Home/Landing";
import Projects from "../pages/Project/ProjectHome";
import CreateProject from "../pages/Project/CreateProject";
import ProjectPage from "../pages/Project/ProjectPage";
import CreateEnvironment from "../pages/Environment/CreateEnvironment";
import UpdateEnvironment from "../pages/Environment/UpdateEnvironment";
import UpdateProject from "../pages/Project/UpdateProject";
import PATHome from "../pages/PAT/PATHome";
import AddPAT from "../pages/PAT/AddPAT";
import PATPage from "../pages/PAT/PATPage";
import PATFilteredProjects from "../pages/PAT/PATFilteredProjects";
import TeamHome from "../pages/Team/TeamHome";
import CreateMember from "../pages/Team/CreateMember";
import ModifyPermissionsPage from "../pages/Team/ModifyPermissions";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/addAdmin" element={<RegisterAdmin />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/error" element={<h1>Something went wrong</h1>}></Route>
        <Route path="/editProfile" element={<EditProfile />}></Route>
        <Route path="/changePassword" element={<ChangePassword />}></Route>
        <Route path="/projects" element={<Projects />}></Route>
        <Route path="projects/createProject" element={<CreateProject />}></Route>
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        <Route path="/projects/environment/addEnvironment" element={<CreateEnvironment />}></Route>
        <Route path="/projects/:projectId/environment/:environmentNumber/edit/:environmentId" element={<UpdateEnvironment />}></Route>
        <Route path="/projects/:projectId/update" element={<UpdateProject />}></Route>
        <Route path="/pats" element={<PATHome />}></Route>
        <Route path="pats/addPat" element={<AddPAT />}></Route>
        <Route path="/pats/:patId" element={<PATPage />} /> 
        <Route path="/pats/:patId/addProjectToPAT" element={<PATFilteredProjects />}></Route>
        <Route path="/team" element={<TeamHome />}></Route>
        <Route path="/team/addMember" element={<CreateMember />}></Route>
        <Route path="/members/:userId/permissions" element={<ModifyPermissionsPage />}></Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
