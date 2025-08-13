import { FileText, Sparkles, Loader } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { config } from "../config/config.js";
import { usePlanChecker } from "../utils/planChecker.js";
import Markdown from "react-markdown";

// Set axios base URL
axios.defaults.baseURL = config.baseURL;

const ReviewResume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewHistory, setReviewHistory] = useState([]);
  const [hasPremium, setHasPremium] = useState(false);

  const { getToken } = useAuth();
  const { checkPremiumPlan, isLoaded } = usePlanChecker();

  // Check user's premium plan on component mount
  useEffect(() => {
    const checkPlan = async () => {
      if (isLoaded) {
        const premiumStatus = await checkPremiumPlan();
        setHasPremium(premiumStatus);
      }
    };

    checkPlan();
  }, [isLoaded, checkPremiumPlan]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = "";
        return;
      }
      // Validate file type (PDF only)
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file only");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a PDF resume file");
      return;
    }

    // Check if user has premium plan
    if (!hasPremium) {
      toast.error(
        "This feature is only available for premium users. Please upgrade to premium to continue."
      );
      return;
    }

    try {
      setIsLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setReviewContent(data.content);
        setReviewHistory((prevReviews) => [
          {
            original: selectedFile.name,
            content: data.content,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prevReviews,
        ]);
        setSelectedFile(null);
        // Reset file input
        e.target.reset();
        toast.success("Resume reviewed successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 403) {
        toast.error(
          "This feature is only available for premium users. Please upgrade to premium to continue."
        );
      } else {
        toast.error("Failed to review resume");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>

        {/* Plan Status Indicator */}
        {hasPremium ? (
          <div className="mt-3 p-2 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 border border-emerald-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center">
                <span>✨</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <p className="text-xs font-medium text-emerald-800">
                  Premium User - Get professional resume feedback and insights!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 p-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-amber-600 text-sm">⭐</span>
              <p className="text-xs text-amber-700 font-medium">
                Premium Feature - This tool is only available for premium users
              </p>
            </div>
          </div>
        )}

        <p className="mt-6 text-sm font-medium">Upload Resume</p>
        <input
          onChange={handleFileChange}
          type="file"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          accept="application/pdf"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports PDF formats only (Max 5MB)
        </p>

        {selectedFile && (
          <div className="mt-3 p-2 bg-teal-50 rounded border border-teal-200">
            <p className="text-xs text-teal-700">
              <strong>Selected:</strong> {selectedFile.name}
            </p>
            <p className="text-xs text-teal-600">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <button
          disabled={isLoading || !selectedFile || !hasPremium}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 my-1 animate-spin" />
          ) : (
            <FileText className="w-5" />
          )}
          {isLoading ? "Reviewing..." : "Review Resume"}
        </button>

        {/* Plan-specific Messages */}
        {!hasPremium && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Free users:{" "}
              <span className="text-amber-600 font-medium">
                Upgrade to Premium
              </span>{" "}
              to unlock this feature
            </p>
          </div>
        )}
      </form>
      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>

        {!reviewContent ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <FileText className="w-9 h-9" />
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll">
            <div className="mb-4">
              <div>
                <div className="reset-tw">
                  <Markdown>{reviewContent}</Markdown>
                </div>
              </div>
            </div>

            {reviewHistory.length > 1 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Recent Reviews
                </h3>
                <div className="space-y-2">
                  {reviewHistory.slice(1, 3).map((review, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <p className="text-xs text-gray-600 font-medium">
                          {review.original}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {review.timestamp}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {review.content.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
