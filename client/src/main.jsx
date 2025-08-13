import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we're in development or production
const isDevelopment = import.meta.env.DEV;

if (!PUBLISHABLE_KEY) {
  if (isDevelopment) {
    throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in development");
  } else {
    console.error("Missing VITE_CLERK_PUBLISHABLE_KEY in production");
  }
}

// Only render if we have a key
if (PUBLISHABLE_KEY) {
  createRoot(document.getElementById("root")).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  );
} else {
  // Show error message instead of white screen
  document.getElementById("root").innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
      <div style="text-align: center; padding: 20px;">
        <h1>Configuration Error</h1>
        <p>Missing Clerk publishable key. Please check your environment variables.</p>
        <p>If you're the developer, add VITE_CLERK_PUBLISHABLE_KEY to your Vercel environment variables.</p>
      </div>
    </div>
  `;
}
