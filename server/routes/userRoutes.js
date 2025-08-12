import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import {
  testDatabase,
  getPublishedCreations,
  getUserCreations,
  ToggleLikeCreation,
} from "../controllers/userController.js";

const userRouter = Router();

// Test route (no auth required)
userRouter.get("/test-db", testDatabase);

userRouter.get("/get-user-creations", auth, getUserCreations);
userRouter.get("/get-published-creations", auth, getPublishedCreations);
userRouter.post("/toggle-like-creation", auth, ToggleLikeCreation);

export default userRouter;
