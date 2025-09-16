// src/components/Navbar.jsx
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#fdf6ec] shadow">
      {/* Logo + Text */}
      <div className="flex items-center gap-x-2">  {/* yahan gap adjust kar sakte ho */}
        <img src="/logo.png" alt="kube-netra" className="w-12 h-12" />
        <h1 className="text-2xl font-bold text-blue-700">Kube-Netra</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-6">
        <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
        <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
        
        <ProfileMenu />
      </div>
    </nav>
  );
};

export default Navbar;
