import React from "react";

const GlobalLoader = () => (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[1000] bg-black/50 backdrop-blur-sm">
        <div className="animate-spin h-16 w-16 border-4 border-white border-t-blue-500 rounded-full"></div>
    </div>
);

export default GlobalLoader;