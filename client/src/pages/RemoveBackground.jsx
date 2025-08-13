import { Eraser, Sparkles, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { config } from "../config/config.js";
import { usePlanChecker } from "../utils/planChecker.js";

// Set axios base URL
axios.defaults.baseURL = config.baseURL;

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedImage, setProcessedImage] = useState("");
  const [imageHistory, setImageHistory] = useState([]);
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
      setSelectedFile(file);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select an image file");
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
      formData.append("image", selectedFile);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setProcessedImage(data.content);
        setImageHistory((prevImages) => [
          {
            original: URL.createObjectURL(selectedFile),
            processed: data.content,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prevImages,
        ]);
        setSelectedFile(null);
        // Reset file input
        e.target.reset();
        toast.success("Background removed successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
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
                  Premium User - Enjoy unlimited background removal!
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

        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={handleFileChange}
          type="file"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          accept="image/*"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports JPG, PNG, and other common image formats (Max 5MB)
        </p>

        {selectedFile && (
          <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
            <p className="text-xs text-orange-700">
              <strong>Selected:</strong> {selectedFile.name}
            </p>
            <p className="text-xs text-orange-600">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <button
          disabled={isLoading || !selectedFile || !hasPremium}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 my-1 animate-spin" />
          ) : (
            <Eraser className="w-5" />
          )}
          {isLoading ? "Processing..." : "Remove Background"}
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
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {!processedImage ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-9 h-9" />
              <p>
                Upload an image and click "Remove Background" to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll">
            <div className="mb-4">
              <img
                src={processedImage}
                alt="Background removed image"
                className="w-full rounded-lg shadow-md"
              />
              <div className="mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                <p className="text-xs text-orange-700">
                  <strong>Status:</strong> Background removed successfully
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  <strong>Processed:</strong> {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>

            {imageHistory.length > 1 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Recent Images
                </h3>
                <div className="space-y-2">
                  {imageHistory.slice(1, 3).map((img, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                    >
                      <div className="flex gap-1">
                        <img
                          src={img.original}
                          alt="Original image"
                          className="w-12 h-12 rounded object-cover border"
                        />
                        <img
                          src={img.processed}
                          alt="Processed image"
                          className="w-12 h-12 rounded object-cover border"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600">Before → After</p>
                        <p className="text-xs text-gray-500">{img.timestamp}</p>
                      </div>
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

export default RemoveBackground;
