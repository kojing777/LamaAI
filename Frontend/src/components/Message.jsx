import { useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import prism from "prismjs";

const Message = ({ Message }) => {
  useEffect(() => {
    prism.highlightAll();
  }, [Message.content]);

  return (
    <div className="px-2 sm:px-4">
      {Message.role === "user" ? (
        <div className="flex items-start justify-end gap-3 my-4 sm:my-6">
          <div className="flex flex-col items-end gap-2 max-w-full sm:max-w-2xl">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg relative overflow-hidden">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <p className="text-sm leading-relaxed relative z-10">{Message.content}</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
              {moment(Message.timestamp).format("h:mm A")}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md relative">
            <img
              src={assets.user_icon}
              className="w-5 h-5 rounded-full"
              alt="User"
            />
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 my-4 sm:my-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b46ff] to-[#4d7fff] flex items-center justify-center flex-shrink-0 shadow-md relative">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-xs font-bold bg-gradient-to-r from-[#8b46ff] to-[#4d7fff] bg-clip-text text-transparent">
                AI
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 max-w-full sm:max-w-2xl flex-1">
            {Message.isImage ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md p-3 sm:p-4 shadow-lg relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 left-0 w-6 h-6 bg-gradient-to-br from-[#8b46ff] to-[#4d7fff] rounded-br-full"></div>
                <img
                  src={Message.content}
                  className="w-full max-w-md rounded-lg shadow-md"
                  alt="AI Generated"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                  🖼️ AI Generated
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 left-0 w-6 h-6 bg-gradient-to-br from-[#8b46ff] to-[#4d7fff] rounded-br-full"></div>
                <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed reset-tw relative z-10">
                  <Markdown>{Message.content}</Markdown>
                </div>
              </div>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
              {moment(Message.timestamp).format("h:mm A")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;