import { ArrowRight, Sparkles } from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div
      className="fixed z-5 w-full backdrop-blur-2xl flex justify-between
items-center py-3 px-4 sm:px-20 x1l:px-32"
    >
      {/* <img
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => navigate("/")}
      /> */}

      <h2
        className="text-2xl font-bold flex items-center gap-1 cursor-pointer sm:text-3xl"
        onClick={() => navigate("/")}
      >
        {/* icon */}
        <Sparkles className="w-6 h-6" />
        <div>
          <span className="text-primary">AI</span>
          <span className="text-gray-800">Genie</span>
        </div>
      </h2>
      {user ? (
        <UserButton />
      ) : (
        <button
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-5 sm:px-10 sm:py-2.5 py-2"
          onClick={openSignIn}
        >
          <p className="inline sm:hidden">Start</p>
          <p className="hidden sm:inline">Get started</p>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
