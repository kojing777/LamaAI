import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Sidebar = () => {
  const { chats, theme, setSelectedChat, setTheme, user } = useAppContext();
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
    </div>
  );
};

export default Sidebar;
