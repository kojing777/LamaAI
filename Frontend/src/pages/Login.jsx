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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-10 py-8 transition-colors duration-300">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6 md:p-8 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 transition-colors duration-300">
        {/* Logo */}
        <div className="mb-2 sm:mb-4 md:mb-6 w-full flex justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
            <Logo />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5 mt-2"
        >
          {/* Name */}
          {state === "register" && (
            <div className="flex flex-col gap-1 sm:gap-2">
              <label className="text-gray-600 font-medium text-sm sm:text-base md:text-lg">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm sm:text-base md:text-lg"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-gray-600 font-medium text-sm sm:text-base md:text-lg">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm sm:text-base md:text-lg"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-gray-600 font-medium text-sm sm:text-base md:text-lg">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              className="border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm sm:text-base md:text-lg"
              required
            />
          </div>

          {/* Toggle Login/Register */}
          <p className="text-gray-600 text-xs sm:text-sm md:text-base text-center mt-2 sm:mt-4">
            {state === "register"
              ? "Already have an account? "
              : "Don't have an account? "}
            <span
              onClick={() => setState(state === "login" ? "register" : "login")}
              className="text-purple-700 font-medium cursor-pointer hover:underline transition-colors duration-200"
            >
              {state === "login" ? "Sign Up" : "Login"}
            </span>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-3 md:py-4 rounded-lg font-medium shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 w-full text-sm sm:text-base md:text-lg mt-2 sm:mt-4"
          >
            {state === "register" ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;