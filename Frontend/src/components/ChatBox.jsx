import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/appContext";
import { assets } from "../assets/assets";
import Message from "./Message";

const ChatBox = () => {
  const containerRef = useRef(null);
  const { selectedChat, theme, user, axios, setUser } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    // Call your API or function to send the message
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* chat messages */}
      <div ref={containerRef} className="flex-1 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              className="w-full max-w-56 sm:max-w-68"
              alt=""
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask Me Anything
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <Message key={index} Message={message} />
        ))}
        {/* three dots loading indicator */}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          </div>
        )}
      </div>
      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}
      {/* prompt input box */}
      <form
        className="bg-primary/20 dark:bg-[#57317c]/30 border border-primary dark:border-[#80609f]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
        onSubmit={onSubmit}
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm pl-3 pr-2 outline-none"
        >
          <option className="dark:bg-purple-900" value="text">
            text
          </option>
          <option className="dark:bg-purple-900" value="image">
            image
          </option>
        </select>
        <input
          type="text"
          placeholder="Type your message here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 w-full text-sm outline-none"
          required
        />
        <button disabled={loading} type="submit" className="ml-3">
          <img
            className="w-8 cursor-pointer"
            src={loading ? assets.stop_icon : assets.send_icon}
            alt=""
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
