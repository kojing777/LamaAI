import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingUser(false);
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) return toast("Log in to create a new chat");

      // api call to create a new chat
      const { data } = await axios.get("/api/chat/create", {
        headers: { Authorization: token },
      });

      if (data.success && data.chat) {
        // Fetch updated chats list
        const { data: chatsData } = await axios.get("/api/chat/get", {
          headers: { Authorization: token },
        });

        if (chatsData.success) {
          setChats(chatsData.chats);

          // Find and select the newly created chat by ID
          const newChat = chatsData.chats.find(
            (chat) => chat._id === data.chat._id
          );
          if (newChat) {
            setSelectedChat(newChat);
          } else {
            // fallback: select the most recent chat
            if (chatsData.chats.length > 0) {
              setSelectedChat(chatsData.chats[chatsData.chats.length - 1]);
            }
          }
        }
      } else {
        toast.error(data.message || "Failed to create new chat");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUsersChats = async () => {
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setChats(data.chats);

        if (data.chats.length === 0) {
          // If no chats exist, create a new one
          await createNewChat();
        } else {
          // ✅ Only set default if no chat is already selected
          setSelectedChat((prev) => prev || data.chats[data.chats.length - 1]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsersChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token]);

  const value = {
    user,
    setUser,
    navigate,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    token,
    setToken,
    createNewChat,
    fetchUsersChats,
    loadingUser,
    fetchUser,
    setLoadingUser,
    axios,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
