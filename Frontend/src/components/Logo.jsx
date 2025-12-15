import chatIcon from "../assets/bot.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Icon */}
      <img
        src={chatIcon}
        alt="Lama Logo"
        className="w-12 h-12 dark:filter dark:invert dark:brightness-100"
      />

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">
          LAMA
        </span>
        <span className="text-sm text-black dark:text-dark-text-secondary">
          Intelligent Ai Assistant
        </span>
      </div>
    </div>
  );
};

export default Logo;
