// src/pages/Home.jsx
import FeatureCard from "../../components/FeatureCard";
import Navbar from "../../components/Navbar";

const features = [
  {
    title: "Projects",
    description: "Manage your Kubernetes projects seamlessly.",
    buttonText: "Click Here",
    onClick: () => console.log("Projects clicked"),
  },
  {
    title: "GitHub PAT",
    description: "Manage Personal Access Tokens securely.",
    buttonText: "Click Here",
    onClick: () => console.log("GitHub PAT clicked"),
  },
  {
    title: "Manage Team",
    description: "Invite and manage your team members.",
    buttonText: "Click Here",
    onClick: () => console.log("Add Members clicked"),
  },
];

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/bg-auth.jpg')" }}
    >
      {/* Card wrapper */}
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        {/* Navbar */}
        <Navbar />

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
      </div>
    </div>
  );
};

export default Home;
