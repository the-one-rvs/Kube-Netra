// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterAdmin from "../pages/Auth/RegisterAdmin";
import Home from "../pages/Home/Home";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/addAdmin" element={<RegisterAdmin />} />
        
      </Routes>
    </Router>
  );
};

export default AppRoutes;
