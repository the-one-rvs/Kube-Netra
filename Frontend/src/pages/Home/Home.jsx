// src/pages/Home.jsx
import FeatureCard from "../../components/FeatureCard";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendQuery, clearStatus } from "../../features/query/querySlice";
import { useEffect } from "react";

const features = [
  {
    emoji: "📦",
    title: "Projects",
    description: "Manage your Kubernetes projects seamlessly.",
    buttonText: "Click Here",
    onClick: () => console.log("Projects clicked"),
  },
  {
    emoji: "🔑",
    title: "GitHub PAT",
    description: "Manage Personal Access Tokens securely.",
    buttonText: "Click Here",
    onClick: () => console.log("GitHub PAT clicked"),
  },
  {
    emoji: "👥",
    title: "Manage Team",
    description: "Invite and manage your team members.",
    buttonText: "Click Here",
    onClick: () => console.log("Add Members clicked"),
  },
];


const Home = () => {
    const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.query);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendQuery({ email, msg }));
  };

  // Alert messages auto-clear after 3s
  useEffect(() => {
    if (success || error) {
      setTimeout(() => {
        dispatch(clearStatus());
      }, 3000);
    }
  }, [success, error, dispatch]);
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/bg-auth.jpg')" }}
    >
      {/* <Navbar color="text-blue-600" hoverColor="hover:text-black" /> */}
      {/* Floating navbar aligned to card */}
      <div className="fixed top-0 left-0 w-full flex justify-center z-50">
        <Navbar color="text-blue-600" hoverColor="hover:text-black" />
      </div>

      {/* Card wrapper */}
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        {/* Navbar
        <Navbar color="text-blue-600" hoverColor="hover:text-black" /> */}

        {/* Features */}
        <section
          id="features"
          className="py-16 px-6 md:px-20 bg-gray-50"
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <FeatureCard key={idx} {...f} />
            ))}
          </div>
        </section>

        {/* About */}
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
              environments — <u>starting from Dev → Test → Prod</u> in a
              controlled and orderly manner.
            </p>

            <p>
              By bridging the gap between image updates and environment rollouts,
              <strong>Kube-Netra</strong> essentially builds promotion pipelines
              without the need for heavy CI/CD scripting. It brings{" "}
              <strong className="text-blue-700">visibility</strong>,{" "}
              <strong className="text-green-700">consistency</strong>, and{" "}
              <strong className="text-purple-700">reliability</strong> to the
              release cycle by ensuring that the latest application versions move
              seamlessly through the stages of deployment.
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

            {/* ✅ Alerts */}
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
