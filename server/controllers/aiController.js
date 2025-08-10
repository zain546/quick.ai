import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    // Get authentication data using req.auth() since we're using requireAuth()
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const { prompt, length } = req.body;
    if (!prompt || !length) {
      return res.status(400).json({
        message: "Prompt and length are required",
      });
    }

    // Check user's plan and usage
    const user = await clerkClient.users.getUser(userId);
    const hasPremiumPlan = user.publicMetadata.plan === "premium";
    const free_usage = user.privateMetadata.free_usage || 0;

    if (!hasPremiumPlan && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message:
          "You have reached your free usage limit, upgrade to premium to continue",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });
    const content = response.choices[0].message.content;

    // Save to database
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    // Track usage for free users
    if (!hasPremiumPlan) {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      message: "Article generated successfully",
      content,
      prompt,
      length,
      free_usage: !hasPremiumPlan ? free_usage + 1 : free_usage,
    });
  } catch (error) {
    console.error("Error in generateArticle:", error);
    // Provide a proper status code
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      message: error.message,
      error: error.toString(),
    });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    // Get authentication data using req.auth() since we're using requireAuth()
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    // Check user's plan and usage
    const user = await clerkClient.users.getUser(userId);
    const hasPremiumPlan = user.publicMetadata.plan === "premium";
    const free_usage = user.privateMetadata.free_usage || 0;

    if (!hasPremiumPlan && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message:
          "You have reached your free usage limit, upgrade to premium to continue",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });
    const content = response.choices[0].message.content;

    // Save to database
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    // Track usage for free users
    if (!hasPremiumPlan) {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      message: "Blog title generated successfully",
      content,
      prompt,
      free_usage: !hasPremiumPlan ? free_usage + 1 : free_usage,
    });
  } catch (error) {
    console.error("Error in generateArticle:", error);
    // Provide a proper status code
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      message: error.message,
      error: error.toString(),
    });
  }
};

export const generateImage = async (req, res) => {
  try {
    // Get authentication data using req.auth() since we're using requireAuth()
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const { prompt, publish } = req.body;
    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    // Check user's plan and usage
    const user = await clerkClient.users.getUser(userId);
    const hasPremiumPlan = user.publicMetadata.plan === "premium";
    const free_usage = user.privateMetadata.free_usage || 0;

    if (!hasPremiumPlan) {
      return res.status(403).json({
        success: false,
        message:
          "This feature is only available for premium users, upgrade to premium to continue",
      });
    }
    const formData = new FormData()
    formData.append('prompt', prompt)
    const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{
      headers: {
        'x-api-key': `${process.env.CLIPDROP_API_KEY}`,
        responseType: 'arraybuffer'
      }
    })
    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;
    const imageUrl = await uploadImage(base64Image);

    // Save to database
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    // Track usage for free users
    if (!hasPremiumPlan) {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      message: "Image generated successfully",
      content,
      prompt,
      free_usage: !hasPremiumPlan ? free_usage + 1 : free_usage,
    });
  } catch (error) {
    console.error("Error in generateArticle:", error);
    // Provide a proper status code
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      message: error.message,
      error: error.toString(),
    });
  }
};
