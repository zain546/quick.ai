import { useAuth } from "@clerk/clerk-react";

/**
 * Custom hook to check user's premium plan status
 * @returns {Object} Object containing premium plan status and loading state
 */
export const usePlanChecker = () => {
  const { has, isLoaded } = useAuth();
  
  const checkPremiumPlan = async () => {
    if (!isLoaded) return false;
    
    try {
      const hasPremium = await has({ plan: "premium" });
      return hasPremium;
    } catch (error) {
      console.error("Error checking premium plan:", error);
      return false;
    }
  };

  return {
    checkPremiumPlan,
    isLoaded,
    has
  };
};

/**
 * Utility function to get plan status (for use outside of React components)
 * @param {Object} auth - Clerk auth object
 * @returns {Promise<boolean>} Whether user has premium plan
 */
export const getPlanStatus = async (auth) => {
  if (!auth) return false;
  
  try {
    const hasPremium = await auth.has({ plan: "premium" });
    return hasPremium;
  } catch (error) {
    console.error("Error checking premium plan:", error);
    return false;
  }
};
