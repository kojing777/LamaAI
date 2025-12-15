import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Logo from "../components/Logo";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { axios, setToken } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = state === "login" ? "/api/user/login" : "/api/user/register";
    try {
      const { data } = await axios.post(url, { name, email, password });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(
          state === "login"
            ? "Login successful!"
            : "Account created successfully!"
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="bg-light-card dark:bg-dark-card rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 flex flex-col items-center gap-4 sm:gap-6 transition-colors duration-300 border border-gray-200 dark:border-dark-hover/30">
        {/* Logo */}
        <div className="mb-4">
          <Logo />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-3 sm:gap-4 mt-2"
        >
          {/* Name */}
          {state === "register" && (
            <div className="flex flex-col gap-1">
              <label className="text-light-text-secondary dark:text-dark-text-secondary font-medium text-sm sm:text-base">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="border border-gray-300 dark:border-dark-hover rounded-lg p-2 sm:p-3 bg-light-primary dark:bg-dark-primary text-light-text-primary dark:text-dark-text-primary placeholder-light-text-tertiary dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-light-text-accent dark:focus:ring-icon-active transition text-sm sm:text-base"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-light-text-secondary dark:text-dark-text-secondary font-medium text-sm sm:text-base">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="border border-gray-300 dark:border-dark-hover rounded-lg p-2 sm:p-3 bg-light-primary dark:bg-dark-primary text-light-text-primary dark:text-dark-text-primary placeholder-light-text-tertiary dark:placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-accent dark:focus:ring-icon-active transition text-sm sm:text-base"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-light-text-secondary dark:text-dark-text-secondary font-medium text-sm sm:text-base">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              className="border border-gray-300 dark:border-dark-hover rounded-lg p-2 sm:p-3 bg-light-primary dark:bg-dark-primary text-light-text-primary dark:text-dark-text-primary placeholder-light-text-tertiary dark:placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-accent dark:focus:ring-icon-active transition text-sm sm:text-base"
              required
            />
          </div>

          {/* Toggle Login/Register */}
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm text-center">
            {state === "register"
              ? "Already have an account? "
              : "Don't have an account? "}
            <span
              onClick={() => setState(state === "login" ? "register" : "login")}
              className="text-light-text-accent dark:text-icon-active font-bold cursor-pointer hover:underline"
            >
              {state === "login" ? "Sign Up" : "Login"}
            </span>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-light-text-accent dark:bg-icon-active hover:bg-blue-600 dark:hover:bg-icon-active/90 text-white py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full"
          >
            {state === "register" ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;