import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { IoSearch } from "react-icons/io5";
import moment from "moment";

const Sidebar = () => {
  const { chats, theme, setSelectedChat, setTheme, user,navigate } = useAppContext();
  const [search, setSearch] = useState("");
  return (
    <div className="flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609f]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1">
      {/* logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt=""
        className="w-full max-w-48"
      />
      {/* new chat button  */}
      <button className="flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#a456f7] to-[#3d81f6] text-sm rounded-md cursor-pointer">
        <span className="mr-2 text-xl">+</span> New Chat
      </button>

      {/* search conversation */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-600 dark:border-white/20 rounded-md">
        <IoSearch className="w-4 dark:invert" />

        {/* <img src={assets.search_icon} alt="" className="w-4 not-dark:invert" /> */}
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search Conversation"
          className="text-xs placeholder:text-gray-400 outline-none"
        />
      </div>
      {/* Recent Chats */}
      {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}
      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              className="p-2 px-4 dark:bg-[#57317c]/10 border border-gray-300 dark:border-[#80609f]/15 rounded-md cursor-pointer flex justify-between group"
            >
              <div>
                <p className="truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                  <p className="text-sm text-gray-500 dark:text-[#b1a6c0]">
                    {moment(chat.updatedAt).fromNow()}
                  </p>
                </p>
              </div>
              <img
                src={assets.bin_icon}
                alt=""
                className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
              />
            </div>
          ))}
      </div>

      {/* Community images */}
      <div onClick={()=>{navigate('/community')}} className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all">
          <img src={assets.gallery_icon} className="w-4.5 not-dark:invert" alt="" />
          <div className="flex flex-col text-sm">
            <p>Community Images</p>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;
