import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${
        sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="my-7 w-full">
        <img
          src={user.imageUrl}
          alt="user avatar"
          className="w-13 rounded-full mx-auto"
        />
        <h1 className="text-center mt-1">{user.fullName}</h1>
        <div className="mt-5 px-5 text-sm text-gray-600 font-medium">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to == "/ai"}
              onclick={() => setSidebar(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 px-3.5 rounded ${
                  isActive
                    ? "bg-gradient-to-r from-[#3C81F6] to-[#9234ea] text-white"
                    : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={openUserProfile}
        >
          <img
            src={user.imageUrl}
            alt="user avatar"
            className="w-8 rounded-full"
          />
          <div>
            <h1 className="font-medium text-sm">{user.fullName}</h1>
            <p className="text-xs text-gray-500">
              <Protect plan="premium" fallback="Free">
                Premuim
              </Protect>{" "}
              plan
            </p>
          </div>
        </div>
        <LogOut
          className="w-4 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          onClick={signOut}
        />
      </div>
    </div>
  );
};

export default Sidebar;
