import { useEffect } from "react";
import moment from "moment";
import Markdown from "react-markdown";
import prism from "prismjs";
import { FaUserCircle } from "react-icons/fa";

const Message = ({ Message }) => {
  useEffect(() => {
    prism.highlightAll();
  }, [Message.content]);

  return (
    <div className="px-2 sm:px-4">
      {Message.role === "user" ? (
        <div className="flex items-start justify-end gap-3 my-4 sm:my-6">
          <div className="flex flex-col items-end gap-2 max-w-full sm:max-w-2xl">
            <div className="bg-gray-500 dark:bg-amber-50 dark:text-black text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg relative overflow-hidden">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <p className="text-sm leading-relaxed relative z-10">
                {Message.content}
              </p>
            </div>
            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary px-1">
              {moment(Message.timestamp).format("h:mm A")}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0 shadow-md relative">
            <FaUserCircle className="w-5 h-5 rounded-full" />

            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 my-4 sm:my-6">
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0 shadow-md relative">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-xs font-bold bg-gradient-to-r from-[#8b46ff] to-[#4d7fff] bg-clip-text text-transparent">
                AI
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 max-w-full sm:max-w-2xl flex-1">
            {Message.isImage ? (
              <div className="bg-light-card dark:bg-dark-card border border-gray-200 dark:border-dark-hover/30 rounded-2xl rounded-bl-md p-3 sm:p-4 shadow-lg relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 left-0 w-6 h-6 bg-gray-300 rounded-br-full"></div>
                <img
                  src={Message.content}
                  className="w-full max-w-md rounded-lg shadow-md"
                  alt="AI Generated"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 dark:bg-dark-modal/80 text-white dark:text-dark-text-primary text-xs rounded-full backdrop-blur-sm">
                  🖼️ AI Generated
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-hover/30 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 left-0 w-6 h-6 bg-gray-300 rounded-br-full"></div>
                <div className="text-sm text-light-text-primary dark:text-dark-text-primary leading-relaxed reset-tw relative z-10">
                  <Markdown>{Message.content}</Markdown>
                </div>
              </div>
            )}
            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary px-1">
              {moment(Message.timestamp).format("h:mm A")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
