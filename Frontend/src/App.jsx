import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";

const App = () => {
  return (
    <>
      <div>
        <Sidebar />
        <Routes>
          <Route path="/" element={<ChatBox />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
