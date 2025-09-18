// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterAdmin from "../pages/Auth/RegisterAdmin";
import Login from "../pages/Auth/Login";
import Home from "../pages/Home/Home";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/addAdmin" element={<RegisterAdmin />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/error" element={<h1>Something went wrong</h1>}></Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
