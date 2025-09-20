// src/pages/Home.jsx
import FeatureCard from "../../components/FeatureCard";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendQuery, clearStatus } from "../../features/query/querySlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const { loading, success, error } = useSelector((state) => state.query);

  const features = [
    {
      emoji: "📦",
      title: "Projects",
      description: "Manage your Kubernetes projects seamlessly.",
      buttonText: "Click Here",
      btncolor: "bg-red-600",
      hovercolor: "hover:bg-blue-700",
      onClick: () => navigate("/projects"),
    },
    {
      emoji: "🔑",
      title: "GitHub PAT",
      description: "Manage Personal Access Tokens securely.",
      buttonText: "Click Here",
      btncolor: "bg-yellow-800",
      hovercolor: "hover:bg-blue-700",
      onClick: () => navigate("/patHome"),
    },
    {
      emoji: "👥",
      title: "Manage Team",
      description: "Invite and manage your team members.",
      buttonText: "Click Here",
      btncolor: "bg-green-600",
      hovercolor: "hover:bg-blue-700",
      onClick: () => navigate("/teamHome"),
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendQuery({ email, msg }));
  };

  // Clear success/error after 3s
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => dispatch(clearStatus()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center p-6"
      style={{ backgroundImage: "url('/bg-auth.jpg')" }}
    >
      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 w-full flex justify-center z-50">
        <Navbar color="text-blue-600" hoverColor="hover:text-black" />
      </div>

      {/* Card wrapper */}
      <div className="w-full max-w-6xl mt-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Features Section */}
        <section id="features" className="py-16 px-6 md:px-20 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <FeatureCard key={idx} {...f} />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-6 md:px-20 bg-white">
          <h2 className="text-3xl font-bold text-center mb-6">About</h2>
          <div className="text-gray-700 max-w-3xl mx-auto text-center space-y-4 leading-relaxed">
            <p>
              <strong>Kube-Netra</strong> is an intelligent release management
              and promotion automation tool for Kubernetes environments.  
              It continuously watches your container registry (<u>like
              DockerHub</u>) for new image tags. The moment a new image is
              detected, <strong>Kube-Netra</strong> automatically patches the
              corresponding Helm manifests and promotes the changes across your
              environments — <u>starting from Dev → Test → Prod</u>.
            </p>

            <p>
              By bridging the gap between image updates and environment rollouts,
              <strong>Kube-Netra</strong> essentially builds promotion pipelines
              without heavy CI/CD scripting. It brings{" "}
              <strong className="text-blue-700">visibility</strong>,{" "}
              <strong className="text-green-700">consistency</strong>, and{" "}
              <strong className="text-purple-700">reliability</strong> to the
              release cycle.
            </p>

            <p className="font-semibold underline">
              Think of it as your automated release manager for Kubernetes:
            </p>
            <ul className="list-disc text-left mx-auto w-fit space-y-1">
              <li>🔍 <strong>Watches</strong> container registries for new tags.</li>
              <li>⚙️ <strong>Patches</strong> Helm manifests dynamically.</li>
              <li>📈 <strong>Promotes</strong> releases across environments step by step.</li>
              <li>🔒 <strong>Ensures safer & faster</strong> delivery with minimal manual intervention.</li>
            </ul>

            <p>
              With <strong>Kube-Netra</strong>, teams can achieve{" "}
              <u>hands-free release management</u>, reduce deployment drift, and
              embrace a smarter way to ship software in Kubernetes 🚀
            </p>
          </div>
        </section>

        {/* Query Section */}
        <section id="query" className="py-16 px-6 md:px-20 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Having Issues?
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-10 bg-[#fdf6ec] rounded-2xl shadow-lg p-8">
            {/* Left - Image */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/logo.png"
                alt="Kube-Netra"
                className="w-56 h-56 object-contain"
              />
            </div>

            {/* Right - Form */}
            <div className="md:w-1/2 w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Your Query..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Query"}
                </button>
              </form>

              {/* Alerts */}
              {success && (
                <div className="mt-4 text-center text-green-600 font-semibold">
                  {success}
                </div>
              )}
              {error && (
                <div className="mt-4 text-center text-red-600 font-semibold">
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
