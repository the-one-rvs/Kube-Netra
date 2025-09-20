// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterAdmin from "../pages/Auth/RegisterAdmin";
import Login from "../pages/Auth/Login";
import Home from "../pages/Home/Home";
import { Edit } from "lucide-react";
import EditProfile from "../pages/User/EditProfile";
import ChangePassword from "../pages/User/ChangePassword";
import Landing from "../pages/Home/Landing";
import Projects from "../pages/Project/ProjectHome";
import CreateProject from "../pages/Project/CreateProject";

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
      </Routes>
    </Router>
  );
};

export default AppRoutes;
