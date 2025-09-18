import React from "react";

const Loading = () => {
  return (
    <div className="bg-gradient-to-b from-[#531b81] to-[#29184b] backdrop-capacity-60 flex items-center justify-center h-screen w-screen text-white text-2xl">
      <div className="w-10 h-10 rounded-full border-3 border-white border-t-transparent animate-spin"></div>
    </div>
  );
};

export default Loading;
