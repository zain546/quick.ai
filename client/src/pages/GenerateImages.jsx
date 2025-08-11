import { Hash, Image, Sparkles, Loader } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { config } from "../config/config.js";
import { usePlanChecker } from "../utils/planChecker.js";

// Set axios base URL
axios.defaults.baseURL = config.baseURL;

const GenerateImages = () => {
  const ImageStyle = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "Realistic style",
    "3D style",
    "Portrait style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
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

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please describe the image you want to generate");
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
      const prompt = `Generate an image of: ${input} in ${selectedStyle} style. Make it high quality and visually appealing.`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        {
          prompt,
          publish,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        setGeneratedImage(data.content);
        setImageHistory((prevImages) => [
          {
            url: data.content,
            prompt: input,
            style: selectedStyle,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prevImages,
        ]);
        setInput("");
        toast.success("Image generated successfully!");
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
        toast.error("Failed to generate image");
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
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        {/* Plan Status Indicator */}
        {hasPremium ? (
          <div className="mt-3 p-2 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 border border-emerald-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center">
                <span>✨</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <p className="text-sm font-semibold text-emerald-800">
                  Premium User
                </p>
                <span className="text-xs text-emerald-700">
                  Create unlimited AI-generated images with premium quality!
                </span>
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

        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 "
          placeholder="Describe what you want to see in your image..."
          required
        />
        <p className="mt-4 text-sm font-medium">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {ImageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              key={item}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? "bg-green-50 text-green-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="my-6 flex items-center gap-2">
          <label htmlFor="publish" className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              id="publish"
              className="sr-only peer"
            />

            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>

            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Make this image Public</p>
        </div>
        <button
          disabled={isLoading || !input.trim() || !hasPremium}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 my-1 animate-spin" />
          ) : (
            <Image className="w-5" />
          )}
          {isLoading ? "Generating..." : "Generate Image"}
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
          <Image className="w-5 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        {!generatedImage ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-9 h-9" />
              <p>Enter a topic and click "Generate Image" to get started.</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll">
            <div className="mb-4">
              <img
                src={generatedImage}
                alt="Generated AI image"
                className="w-full rounded-lg shadow-md"
              />
              <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                <p className="text-xs text-green-700">
                  <strong>Style:</strong> {selectedStyle}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  <strong>Public:</strong> {publish ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {imageHistory.length > 1 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Recent Images
                </h3>
                <div className="space-y-2">
                  {imageHistory.slice(1, 4).map((img, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                    >
                      <img
                        src={img.url}
                        alt="Previous generated image"
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 truncate">
                          {img.prompt}
                        </p>
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

export default GenerateImages;
