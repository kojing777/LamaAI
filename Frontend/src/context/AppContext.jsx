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
      if (!user) return toast("log in to create a new chat");
      navigate("/");

      //api call to create a new chat
      await axios.get("/api/chat/create", {
        headers: { Authorization: token },
      });
      await fetchUsersChats();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createNewChatAfterLogin = async (authToken) => {
    try {
      navigate("/");
      
      // Fetch existing chats
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: authToken },
      });
      
      if (data.success) {
        setChats(data.chats);
        
        if (data.chats.length === 0) {
          // New user - create a new chat
          await axios.get("/api/chat/create", {
            headers: { Authorization: authToken },
          });
          
          // Fetch chats again after creating new one
          const { data: newData } = await axios.get("/api/chat/get", {
            headers: { Authorization: authToken },
          });
          
          if (newData.success && newData.chats.length > 0) {
            setChats(newData.chats);
            setSelectedChat(newData.chats[newData.chats.length - 1]);
          }
        } else {
          // Existing user - redirect to most recent chat
          setSelectedChat(data.chats[data.chats.length - 1]);
        }
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

        // If no chats exist, create a new chat
        if (data.chats.length === 0) {
          await createNewChat();
          return fetchUsersChats();
        } else {
          // Always select the most recent chat (regardless of message content)
          setSelectedChat(data.chats[data.chats.length - 1]);
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
    createNewChatAfterLogin,
    fetchUsersChats,
    loadingUser,
    fetchUser,
    setLoadingUser,
    axios,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
