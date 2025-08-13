import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 my-12 sm:my-16 md:my-20 lg:my-24">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
        <h2 className="text-slate-700 text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold leading-tight">
          Powerful AI Tools
        </h2>
        <p className="mt-3 sm:mt-4 text-gray-600 max-w-sm sm:max-w-md lg:max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge AI technology.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-items-center">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            className="w-full max-w-xs sm:max-w-sm p-4 sm:p-6 md:p-8 rounded-xl bg-[#FDFDFE] shadow-md border border-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg"
            onClick={() => user ? navigate(tool.path) : openSignIn()}
          >
            <tool.Icon 
              className="w-10 h-10 sm:w-12 sm:h-12 p-2.5 sm:p-3 text-white rounded-xl" 
              style={{background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`}}
            />
            <h3 className="mt-3 sm:mt-4 md:mt-6 mb-2 sm:mb-3 font-semibold text-base sm:text-lg text-gray-800">
              {tool.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;
