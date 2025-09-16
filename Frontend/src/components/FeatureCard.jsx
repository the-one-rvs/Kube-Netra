// src/components/FeatureCard.jsx
const FeatureCard = ({ title, description, buttonText, onClick }) => {
  return (
    <div className="rounded-2xl shadow-md hover:shadow-lg transition bg-white p-6 flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 text-center text-sm mb-4">{description}</p>
      <button
        onClick={onClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default FeatureCard;
