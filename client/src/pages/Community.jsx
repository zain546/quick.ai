import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Heart, Loader } from "lucide-react";
import axios from "axios";
import { config } from "../config/config";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = config.baseURL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setCreations(data.creations || []);
        if (data.creations && data.creations.length === 0) {
          toast.success(
            "No published creations found yet. Be the first to share!"
          );
        }
      } else {
        toast.error(data.message || "Failed to fetch creations");
      }
    } catch (error) {
      console.error("Error fetching creations:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to view community creations");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to fetch creations"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeToggle = async (creationId) => {
    if (!user) {
      toast.error("Please login to like creations");
      return;
    }

    try {
      setIsLiking(true);
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { creationId },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        // Update the local state to reflect the like change
        setCreations((prevCreations) =>
          prevCreations.map((creation) =>
            creation.id === creationId
              ? {
                  ...creation,
                  likes: data.data,
                }
              : creation
          )
        );
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to like creations");
      } else {
        toast.error("Failed to update like. Please try again.");
      }
    } finally {
      setIsLiking(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading community creations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Please login to view community creations
          </p>
          <p className="text-sm text-gray-500">
            Join the community to see what others are creating!
          </p>
        </div>
      </div>
    );
  }

  if (creations.length === 0) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">No published creations yet</p>
          <p className="text-sm text-gray-500">
            Be the first to share your AI creations with the community!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Community Creations
        </h1>
        <p className="text-sm text-gray-600">
          {creations.length} published creations
        </p>
      </div>

      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {creations.map((creation, index) => (
          <div
            key={creation.id || index}
            className="relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3"
          >
            <img
              src={creation.content}
              alt={creation.prompt || "AI Generated Image"}
              className="w-full h-full object-cover rounded-lg"
            />

            <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
              <p className="text-sm hidden group-hover:block">
                {creation.prompt || "AI Generated Content"}
              </p>
              <div className="flex items-center gap-1">
                <p>{creation.likes?.length || 0}</p>
                <Heart
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    creation.likes?.includes(user.id)
                      ? "fill-red-500 text-red-600"
                      : "text-white"
                  }`}
                  onClick={() => handleLikeToggle(creation.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
