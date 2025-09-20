const FeatureCard = ({ emoji, title, description, buttonText, onClick, btncolor, hovercolor }) => {
  return (
    <div className="rounded-2xl shadow-md hover:shadow-lg transition bg-white p-6 flex flex-col items-center text-center">
      
      <div className="text-5xl mb-4">{emoji}</div>

      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      <button
        onClick={onClick}
        className={`${btncolor} ${hovercolor} text-white px-4 py-2 rounded-full transition`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default FeatureCard;
