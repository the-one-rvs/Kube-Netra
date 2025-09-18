// src/components/Navbar.jsx
import ProfileMenu from "./ProfileMenu";

const Navbar = ({ color, hoverColor }) => {
  return (
  <nav className="w-full max-w-6xl bg-[#fdf6ec]/90 backdrop-blur-sm shadow rounded-b-2xl flex justify-between items-center px-8 py-4">
    {/* Logo + Text */}
    <div className="flex items-center gap-x-2">
      <img src="/logo.png" alt="kube-netra" className="w-12 h-12" />
      <h1 className={`text-2xl font-bold ${color}`}>Kube-Netra</h1>
    </div>

    {/* Links */}
    <div className="flex items-center space-x-6">
      <a href="#features" className={`${color} ${hoverColor}`}>Features</a>
      <a href="#about" className={`${color} ${hoverColor}`}>About</a>
      <a href="#query" className={`${color} ${hoverColor}`}>Issue</a>
      <ProfileMenu />
    </div>
  </nav>

  );
};

export default Navbar;
