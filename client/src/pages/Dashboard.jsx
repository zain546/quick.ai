import React, { useEffect, useState } from "react";
import { Gem, Sparkles, Loader } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import { config } from "../config/config";
import { toast } from "react-hot-toast";

// Set axios base URL
axios.defaults.baseURL = config.baseURL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setCreations(data.creations || []);
        if (data.creations && data.creations.length === 0) {
          toast.success("No creations yet. Start creating to see them here!");
        }
      } else {
        toast.error(data.message || "Failed to fetch your creations");
      }
    } catch (error) {
      console.error("Error fetching user creations:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to view your creations");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to fetch your creations"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total Creations Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          {/* Content */}
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex items-center justify-center">
            <Sparkles className="w-5 to-white" />
          </div>
        </div>
        {/* Active Plan Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          {/* Content */}
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan={"premium"} fallback="Free">Premium</Protect>
            </h2>
          </div>
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex items-center justify-center">
            <Gem className="w-5" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="mt-6 mb-4">Recent Creations</p>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading your creations...</p>
            </div>
          </div>
        ) : creations.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No creations yet</p>
            <p className="text-sm text-gray-500">
              Start using our AI tools to create amazing content!
            </p>
          </div>
        ) : (
          creations.map((item, index) => (
            <CreationItem key={item.id || index} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
