import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const creations =
      await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
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
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
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

export const ToggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { creationId } = req.body;

    const [creation] =
      await sql`SELECT * FROM creations WHERE id = ${creationId}`;

    if (!creation) {
      return res.json({
        success: false,
        message: "Creation not found",
      });
    }

    const currentLikes = creation.likes;
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if(currentLikes.includes(userIdStr)) {
        updatedLikes = currentLikes.filter((id) => id !== userIdStr);
        message = "Unliked creation";
    } else {
        updatedLikes = [...currentLikes, userIdStr];
        message = "Liked creation";
    }
const formattedArray = `{${updatedLikes.join(",")}}`;

    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${creationId}`;

    res.json({
      success: true,
      message,
      data: updatedLikes,
    });
  } catch (error) {
    res.json({
      success: false,
      error: "Failed to toggle like creation",
      message: error.message,
    });
  }
};
