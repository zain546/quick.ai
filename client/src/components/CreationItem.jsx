import React, { useState } from "react";
import Markdown from "react-markdown";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  // Function to get button colors based on creation type
  const getButtonColors = (type) => {
    switch (type) {
      case "image":
        return "bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534]";
      case "article":
        return "bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF]";
      case "blog-title":
        return "bg-[#FDF4FF] border border-[#E9D5FF] text-[#7C3AED]";
      case "resume-review":
        return "bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]";
      case "remove-background":
        return "bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]";
      case "remove-object":
        return "bg-[#F0F9FF] border border-[#BAE6FD] text-[#0369A1]";
      default:
        return "bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF]";
    }
  };

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 ease-in-out"
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2>{item.prompt}</h2>
          <p className="text-gray-500">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          className={`px-4 py-1 rounded-full font-medium text-sm ${getButtonColors(
            item.type
          )}`}
        >
          {item.type}
        </button>
      </div>

      {/* Expandable content with smooth animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div
          className={`transform transition-transform duration-300 ease-in-out ${
            expanded ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          {item.type === "image" ? (
            <img
              src={item.content}
              alt="image"
              className="w-full max-w-md rounded-lg shadow-sm"
            />
          ) : (
            <div className="h-full overscroll-y-scroll text-sm text-slate-700 bg-gray-50 p-4 rounded-lg">
              <div className="reset-tw">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreationItem;
