import sql from "../configs/db.js";

// Test database connection
export const testDatabase = async (req, res) => {
  try {
    console.log("Testing database connection...");
    const result = await sql`SELECT 1 as test`;
    console.log("Database connection successful:", result);

    res.json({
      success: true,
      message: "Database connection successful",
      data: result,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
};

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = await req.auth();
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    const creations = await sql`
      SELECT * FROM creations 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    res.json({
      success: true,
      message: "User creations fetched successfully",
      creations: creations,
    });
  } catch (error) {
    console.error("Error in getUserCreations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user creations",
      error: error.message,
    });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    console.log("Fetching published creations...");

    // First, let's see what's in the database
    const allCreations = await sql`SELECT * FROM creations LIMIT 5`;
    console.log("Sample creations:", allCreations);

    // Then get published ones
    const creations = await sql`
      SELECT * FROM creations 
      WHERE publish = true 
      ORDER BY created_at DESC
    `;

    console.log(`Found ${creations.length} published creations`);

    res.json({
      success: true,
      message: "Published creations fetched successfully",
      creations: creations,
    });
  } catch (error) {
    console.error("Error in getPublishedCreations:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    res.status(500).json({
      success: false,
      message: "Failed to get published creations",
      error: error.message,
    });
  }
};

export const ToggleLikeCreation = async (req, res) => {
  try {
    const { userId } = await req.auth();
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    const { creationId } = req.body;
    if (!creationId) {
      return res.status(400).json({
        success: false,
        message: "Creation ID is required",
      });
    }

    const [creation] = await sql`
      SELECT * FROM creations WHERE id = ${creationId}
    `;

    if (!creation) {
      return res.status(404).json({
        success: false,
        message: "Creation not found",
      });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((id) => id !== userIdStr);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked";
    }

    const formattedArray = `{${updatedLikes.join(",")}}`;

    await sql`
      UPDATE creations 
      SET likes = ${formattedArray}::text[] 
      WHERE id = ${creationId}
    `;

    res.json({
      success: true,
      message,
      data: updatedLikes,
    });
  } catch (error) {
    console.error("Error in ToggleLikeCreation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle like creation",
      error: error.message,
    });
  }
};
