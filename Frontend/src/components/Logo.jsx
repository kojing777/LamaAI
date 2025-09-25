import chatIcon from "../assets/technology.png";
import ai from "../assets/ai.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Icon */}
      <img src={chatIcon} alt="Lama Logo" className="w-12 h-12" />

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          LAMA
        </span>
        <span className="text-sm text-blue-600 dark:text-blue-400">
          Intelligent Ai Assistant
        </span>
      </div>
    </div>
  );
};

export default Logo;
