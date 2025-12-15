import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";
import Logo from "./Logo";

const ChatBox = () => {
  const containerRef = useRef(null);
  const { selectedChat, user, axios, setUser, token } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast("Please login to continue");
      if (!selectedChat) return toast("Please select or create a chat first");
      setLoading(true);

      const promptCopy = prompt;
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);

      const { data } = await axios.post(
        `/api/message/${mode}`,
        {
          prompt,
          chatId: selectedChat._id,
          isPublished,
        },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);

        if (mode === "text") {
          setUser((prev) => ({ ...prev, credits: prev.credits - 1 }));
        }
        if (mode === "image") {
          setUser((prev) => ({ ...prev, credits: prev.credits - 2 }));
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPrompt("");
      setLoading(false);
    }
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
      <div ref={containerRef} className="flex-1 overflow-y-scroll">
        {!selectedChat ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-primary">
            <div className="mb-2 transform scale-150">
              <Logo />
            </div>
            <p className="mt-6 text-2xl sm:text-4xl text-center text-gray-400 dark:text-dark-text-secondary">
              Please create or select a chat to start messaging
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-primary">
            <div className="mb-2 transform scale-150">
              <Logo />
            </div>
            <p className="mt-6 text-4xl sm:text-6xl text-center text-gray-400 dark:text-dark-text-primary">
              How can I help ?
            </p>
          </div>
        ) : null}
        {messages.map((message, index) => (
          <Message key={index} Message={message} />
        ))}
        {loading && (
          <div className="loader mb-10 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-icon-active animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-icon-active animate-bounce [animation-delay:0.15s]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-icon-active animate-bounce [animation-delay:0.3s]"></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs text-gray-600 dark:text-dark-text-secondary">Publish Generated Image to Community</p>
          <input
            type="checkbox"
            className="cursor-pointer accent-purple-600 dark:accent-icon-active"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      <form
        onSubmit={onSubmit}
        className="bg-white/80 dark:bg-dark-card border border-gray-200 dark:border-dark-hover/30 
                   rounded-full w-full max-w-2xl px-4 py-2 mx-auto flex gap-3 items-center shadow-sm 
                   focus-within:ring-2 focus-within:ring-purple-500/40 dark:focus-within:ring-icon-active/40 transition-all backdrop-blur-sm"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-dark-hover
                     bg-white dark:bg-dark-primary text-gray-900 dark:text-dark-text-primary outline-none cursor-pointer
                     shadow-sm hover:border-purple-500 dark:hover:border-icon-active focus:border-purple-500 dark:focus:border-icon-active
                     transition-colors"
        >
          <option value="text"> Text</option>
          <option value="image"> Image</option>
        </select>

        {/* Input */}
        <input
          type="text"
          placeholder={selectedChat ? "Type your message..." : "Please create or select a chat first"}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 w-full text-sm bg-transparent outline-none px-2 text-gray-900 dark:text-dark-text-primary placeholder-gray-500 dark:placeholder-gray-400"
          disabled={!selectedChat}
          required
        />

        {/* Submit Button */}
        <button
          disabled={loading || !selectedChat}
          type="submit"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors disabled:opacity-50"
        >
          <img
            className="w-6 sm:w-7 cursor-pointer dark:invert opacity-80 dark:opacity-90"
            src={loading ? assets.stop_icon : assets.send_icon}
            alt="send"
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
