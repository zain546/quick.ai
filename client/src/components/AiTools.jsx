import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser,useClerk } from "@clerk/clerk-react";

const AiTools = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const {openSignIn} = useClerk();
  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
      <div className="text-center">
        <h2 className="text-slate-700 text-[42px] font-semibold">
          Powerful AI Tools
        </h2>
        <p className="mt-4text-gray-600 max-w-lg mx-auto">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge AI technology.
        </p>
      </div>
      <div className="flex flex-wrap mt-10 justify-center">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            className="p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-md border border-gray-100 hover:scale-102 transition-all duration-300 cursor-pointer"
            onClick={() => user ? navigate(tool.path): openSignIn()}
          >
            <tool.Icon className="w-12 h-12 p-3 text-white rounded-xl" style={{background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`}}/>
            <h3 className="mt-6 mb-3 font-semibold text-lg">{tool.title}</h3>
            <p className="text-sm max-w-[95%] text-gray-400">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;
