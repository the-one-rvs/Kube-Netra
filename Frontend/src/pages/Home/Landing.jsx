import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Landing = () => {
  const navigate = useNavigate();

  
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  // console.log("All cookies:", document.cookie);
  // console.log("Access Token:", getCookie("accessToken"));


  useEffect(() => {
    const checkAdminAndRedirect = async () => {
      try {
        const res = await axios.get("/api/v1/users/checkAdminExsists", {
          withCredentials: true,
        });

        if (res.data?.message === "Admin not found") {
          navigate("/addAdmin");
        } else {
          const tokenres = await axios.get("/api/v1/users/validateToken", {
            withCredentials: true,
          });

          if (tokenres.data?.message === "Token found successfully") {
            navigate("/home");
          }
          else {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error checking admin:", error);
        navigate("/login"); // fallback
      }
    };

    checkAdminAndRedirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-lg font-medium text-gray-700">Checking setup...</p>
    </div>
  );
};

export default Landing;
