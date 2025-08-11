import { clerkClient } from "@clerk/express";

// Middleware to check if user is authenticated and hasPremiumPlan

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();

    // Check if userId exists
    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const hasPremiumPlan = await has({ plan: "premium" });

    const user = await clerkClient.users.getUser(userId);
    if (!hasPremiumPlan && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage;
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
    }
    req.plan = hasPremiumPlan ? "premium" : "free";
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};
