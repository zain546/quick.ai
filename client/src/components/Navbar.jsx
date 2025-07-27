import { ArrowRight } from "lucide-react";
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
      <img
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => navigate("/")}
      />
      {user ? (
        <UserButton/>
      ) : (
        <button className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5" onClick={openSignIn}>
          Get started
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
