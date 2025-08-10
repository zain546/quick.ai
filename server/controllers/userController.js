import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.json({
      success: true,
      message: "User creations fetched successfully",
      data: creations,
    });
  } catch (error) {
    res.json({
      success: false,
      error: "Failed to get user creations",
      message: error.message,
    });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
    res.json({
      success: true,
      message: "Published creations fetched successfully",
      data: creations,
    });
  } catch (error) {
    res.json({
      success: false,
      error: "Failed to get published creations",
      message: error.message,
    });
  }
};


