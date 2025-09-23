import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { IoSearch } from "react-icons/io5";
import moment from "moment";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    theme,
    setSelectedChat,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUsersChats,
    setToken,
    token,
  } = useAppContext();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleDeleteClick = (e, chatId) => {
    e.stopPropagation();
    setChatToDelete(chatId);
    setShowDeleteModal(true);
  };

  const confirmDeleteChat = async () => {
    try {
      const { data } = await axios.post(
        `/api/chat/delete`,
        { chatId: chatToDelete },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatToDelete));
        await fetchUsersChats();
        toast.success("Chat deleted successfully");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
      setChatToDelete(null);
    }
  };

  const [search, setSearch] = useState("");

  return (
    <>
      <div
        className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609f]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1 ${
          !isMenuOpen && "max-md:-translate-x-full"
        }`}
      >
        {/* logo */}
        <img
          src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
          alt=""
          className="w-full max-w-48"
        />
        {/* new chat button  */}
        <button
          onClick={createNewChat}
          className="flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#a456f7] to-[#3d81f6] text-sm rounded-md cursor-pointer"
        >
          <span className="mr-2 text-xl">+</span> New Chat
        </button>

        {/* search conversation */}
        <div className="flex items-center gap-2 p-3 mt-4 border border-gray-600 dark:border-white/20 rounded-md">
          <IoSearch className="w-4 dark:invert" />
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
                onClick={() => {
                  navigate("/");
                  setSelectedChat(chat);
                  setIsMenuOpen(false);
                }}
                key={chat._id}
                className="p-2 px-4 dark:bg-[#57317c]/10 border border-gray-300 dark:border-[#80609f]/15 rounded-md cursor-pointer flex justify-between group"
              >
                <div className="truncate w-full">
                  <p>
                    {chat.messages.length > 0
                      ? chat.messages[0].content.slice(0, 32)
                      : chat.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-[#b1a6c0]">
                    {moment(chat.updatedAt).fromNow()}
                  </p>
                </div>

                <img
                  src={assets.bin_icon}
                  onClick={(e) => handleDeleteClick(e, chat._id)}
                  alt=""
                  className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
                />
              </div>
            ))}
        </div>

        {/* Community images */}
        <div
          onClick={() => {
            navigate("/community");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-105 transition-all"
        >
          <img
            src={assets.gallery_icon}
            className="w-4.5 not-dark:invert"
            alt=""
          />
          <div className="flex flex-col text-sm">
            <p>Community Images</p>
          </div>
        </div>

        {/* Credit Purchase Option */}
        <div
          onClick={() => {
            navigate("/credits");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-105 transition-all"
        >
          <img src={assets.diamond_icon} className="w-4.5 dark:invert" alt="" />
          <div className="flex flex-col text-sm">
            <p>Credits : {user?.credits}</p>
            <p className="text-sm text-gray-500">
              Purchase Credits to use Elyra
            </p>
          </div>
        </div>

        {/* dark mode toggle */}
        <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md ">
          <div className="flex items-center  gap-2 text-sm">
            <img
              src={assets.theme_icon}
              className="w-4 not-dark:invert"
              alt=""
            />
            <p>Dark Mode</p>
          </div>
          <label className="relative inline-flex cursor-pointer ">
            <input
              onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
            />
            <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
          </label>
        </div>

        {/* user account */}
        <div className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
          <img src={assets.user_icon} className="w-7 rounded-full" alt="" />

          <p className="flex-1 text-sm dark:text-primary truncate">
            {user ? user.name : "Log in your account"}
          </p>
          {user && (
            <img
              onClick={() => setShowLogoutModal(true)}
              className="h-5 cursor-pointer hidden not-dark:invert group-hover:block"
              src={assets.logout_icon}
            />
          )}
        </div>

        <img
          onClick={() => setIsMenuOpen(false)}
          src={assets.close_icon}
          className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
          alt="Close"
        />
      </div>

      {/* === Modal is OUTSIDE the sidebar container, so it will overlay the whole page === */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Are you sure you want to delete this chat?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteChat}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
