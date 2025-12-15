import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { RiMenuFill } from "react-icons/ri";
import { useAppContext } from "../context/AppContext";
import {
  IoSearch,
  IoAdd,
  IoMoon,
  IoSunny,
  IoImages,
  IoDiamond,
  IoPerson,
  IoClose,
  IoLogOutOutline,
  IoTrash,
} from "react-icons/io5";
import moment from "moment";
import toast from "react-hot-toast";
import Logo from "./Logo";
import { assets } from "../assets/assets";

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
  const [search, setSearch] = useState("");

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

  // Filter chats based on search
  const filteredChats = chats.filter((chat) =>
    chat.messages[0]
      ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
      : chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Mobile Menu Button (shows when sidebar is closed) */}
      {!isMenuOpen && (
        <button
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 p-2 bg-black dark:bg-white rounded-lg shadow-lg flex items-center justify-center"
          aria-label="Open menu"
        >
          <RiMenuFill className="text-white dark:text-black" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-dark-modal/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`flex flex-col h-screen w-80 min-w-80 p-6 dark:bg-dark-card bg-light-card border-r border-gray-200 dark:border-dark-hover/30 backdrop-blur-3xl transition-all duration-300 ease-in-out fixed md:relative z-50 shadow-2xl md:shadow-none ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Close Button - Mobile Only */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 dark:bg-dark-hover/50 rounded-full md:hidden hover:scale-110 transition-transform"
        >
          <IoClose className="w-5 h-5 text-light-text-secondary dark:text-icon-primary" />
        </button>

        {/* Logo Section */}
        <div className="flex items-center justify-center mb-8 pt-4 pr-14">
          <Logo />
        </div>

        {/* New Chat Button */}
        <button
          onClick={createNewChat}
          className="flex items-center justify-center w-full py-3.5 mb-6 text-light-text-primary dark:text-dark-text-primary bg-light-card dark:bg-dark-hover hover:bg-light-hover dark:hover:bg-dark-hover/80 border border-gray-200 dark:border-dark-hover text-sm font-medium rounded-xl cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
        >
          <IoAdd className="w-5 h-5 mr-2 dark:text-icon-primary transition-transform" />
          New Chat
        </button>

        {/* Search Conversation */}
        <div className="relative mb-2 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearch className="w-4 h-4 text-light-text-tertiary dark:text-icon-primary group-focus-within:text-light-text-secondary dark:group-focus-within:text-icon-active" />
          </div>
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-3 text-sm bg-light-card dark:bg-dark-primary border border-gray-200 dark:border-dark-hover rounded-xl placeholder-light-text-tertiary dark:placeholder-gray-400 text-light-text-primary dark:text-dark-text-primary outline-none focus:ring-2 focus:ring-light-text-accent/20 dark:focus:ring-icon-active/30 focus:border-light-text-accent/50 dark:focus:border-icon-active/50 transition-all duration-300"
          />
        </div>

        {/* Recent Chats Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {chats.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wide">
                Recent Chats
              </p>
              <span className="bg-light-hover dark:bg-dark-hover text-light-text-primary dark:text-dark-text-primary text-xs px-2 py-1 rounded-full">
                {filteredChats.length}
              </span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-icon-active/30 scrollbar-track-transparent hover:scrollbar-thumb-icon-active/50 space-y-2 pr-2">
            {filteredChats.map((chat) => (
              <div
                onClick={() => {
                  navigate("/");
                  setSelectedChat(chat);
                  setIsMenuOpen(false);
                }}
                key={chat._id}
                className="group p-3 bg-light-card dark:bg-dark-primary border border-gray-200 dark:border-dark-hover/30 rounded-xl cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover hover:border-gray-300 dark:hover:border-dark-hover hover:shadow-md transition-all duration-300 flex items-start justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate leading-tight">
                    {chat.messages.length > 0
                      ? chat.messages[0].content.slice(0, 36) +
                        (chat.messages[0].content.length > 36 ? "..." : "")
                      : chat.name}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    {moment(chat.updatedAt).fromNow()}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDeleteClick(e, chat._id)}
                  className="opacity-0 group-hover:opacity-100 ml-2 p-1.5 bg-light-text-primary dark:bg-dark-hover rounded-lg transition-all duration-300 hover:scale-110"
                >
                  <IoTrash className="w-3.5 h-3.5 text-white dark:text-icon-warning" />
                </button>
              </div>
            ))}

            {filteredChats.length === 0 && chats.length > 0 && (
              <div className="text-center py-8">
                <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-sm">
                  No conversations found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Section */}
        <div className="space-y-3 pt-4 border-t border-gray-200/50 dark:border-dark-hover/30">
          {/* Community Images */}
          <div
            onClick={() => {
              navigate("/community");
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-light-card dark:bg-dark-primary border border-gray-200 dark:border-dark-hover/30 hover:bg-light-hover dark:hover:bg-dark-hover hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-800 dark:bg-dark-hover rounded-lg group-hover:scale-105 transition-transform">
              <IoImages className="w-5 h-5 text-white dark:text-icon-primary group-hover:dark:text-icon-hover" />
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Community Images
              </p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Explore shared creations
              </p>
            </div>
          </div>

          {/* Credit Purchase */}
          <div
            onClick={() => {
              navigate("/credits");
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-light-card dark:bg-dark-primary border border-gray-200 dark:border-dark-hover/30 hover:bg-light-hover dark:hover:bg-dark-hover hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-800 dark:bg-dark-hover rounded-lg group-hover:scale-105 transition-transform">
              <IoDiamond className="w-5 h-5 text-white dark:text-icon-active group-hover:dark:text-icon-hover" />
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Credits:{" "}
                <span className="text-black dark:text-dark-text-accent font-bold">
                  {user?.credits || 0}
                </span>
              </p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Purchase to use Lama
              </p>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-light-card dark:bg-dark-primary border border-gray-200 dark:border-dark-hover/30 hover:bg-light-hover dark:hover:bg-dark-hover hover:border-gray-300 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-800 dark:bg-dark-hover rounded-lg">
                {theme === "dark" ? (
                  <IoMoon className="w-5 h-5 text-white dark:text-icon-primary" />
                ) : (
                  <IoSunny className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Dark Mode
              </span>
            </div>
            <label className="relative inline-flex cursor-pointer">
              <input
                onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                type="checkbox"
                className="sr-only peer"
                checked={theme === "dark"}
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-dark-hover peer-focus:ring-2 peer-focus:ring-icon-active/50 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-icon-active peer-checked:to-icon-active/80 transition-all duration-300"></div>
              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5 shadow-md"></span>
            </label>
          </div>

          {/* User Account */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-light-card dark:bg-dark-primary border border-gray-200 dark:border-dark-hover/30 hover:bg-light-hover dark:hover:bg-dark-hover hover:border-gray-300 hover:shadow-lg transition-all duration-300 group">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-800 dark:bg-dark-hover rounded-lg">
              <FaRegUserCircle className="w-5 h-5 text-white dark:text-icon-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary truncate">
                {user ? user.name : "Guest User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-text-tertiary truncate">
                {user ? user.email : "Log in to your account"}
              </p>
            </div>

            {user && (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="opacity-0 bg-gray-800 dark:bg-dark-hover group-hover:opacity-100 ml-2 p-1.5 rounded-lg transition-all duration-300 hover:scale-110 w-8 h-8 flex items-center justify-center shadow-sm"
              >
                <IoLogOutOutline className="w-4 h-4 text-white dark:text-icon-primary" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 dark:bg-dark-modal/90 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 border border-gray-200 dark:border-dark-hover/30">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-800 dark:bg-dark-hover rounded-full flex items-center justify-center">
              <IoLogOutOutline className="w-6 h-6 text-white dark:text-icon-primary" />
            </div>
            <h2 className="text-lg font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary text-center">
              Log Out?
            </h2>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary text-center mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-light-hover hover:bg-gray-300 dark:bg-dark-hover dark:hover:bg-dark-hover/80 text-light-text-primary dark:text-dark-text-primary rounded-lg font-medium transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-icon-warning dark:to-icon-warning/80 dark:hover:from-icon-warning/90 dark:hover:to-icon-warning/70 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 dark:bg-dark-modal/90 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 border border-gray-200 dark:border-dark-hover/30">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-800 dark:bg-dark-hover rounded-full flex items-center justify-center">
              <IoTrash className="w-6 h-6 text-white dark:text-icon-warning" />
            </div>
            <h2 className="text-lg font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary text-center">
              Delete Chat?
            </h2>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary text-center mb-6">
              This action cannot be undone. The chat will be permanently
              deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-light-hover hover:bg-gray-300 dark:bg-dark-hover dark:hover:bg-dark-hover/80 text-light-text-primary dark:text-dark-text-primary rounded-lg font-medium transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteChat}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-icon-warning dark:to-icon-warning/80 dark:hover:from-icon-warning/90 dark:hover:to-icon-warning/70 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
