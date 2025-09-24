import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import prism from "prismjs";

const Message = ({ Message }) => {
  useEffect(() => {
    prism.highlightAll();
  }, [Message.content]);

  return (
    <div className="px-4">
      {Message.role === "user" ? (
        // User Message - Enhanced
        <div className="flex items-start justify-end gap-3 my-6">
          <div className="flex flex-col items-end gap-2 max-w-2xl">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg">
              <p className="text-sm leading-relaxed">{Message.content}</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
              {moment(Message.timestamp).format("h:mm A")}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <img 
              src={assets.user_icon} 
              className="w-5 h-5 rounded-full" 
              alt="User" 
            />
          </div>
        </div>
      ) : (
        // AI Message - Enhanced
        <div className="flex items-start gap-3 my-6">
          {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <img 
              src={assets.ai_icon} 
              className="w-5 h-5 rounded-full" 
              alt="AI" 
            />
          </div> */}
          <div className="flex flex-col gap-2 max-w-2xl">
            {Message.isImage ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md p-4 shadow-lg">
                <img
                  src={Message.content}
                  className="w-full max-w-md rounded-lg shadow-md"
                  alt="AI Generated"
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
                <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed reset-tw">
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