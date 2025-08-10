import { Router } from "express";
import { generateArticle } from "../controllers/aiController.js";
import { auth } from "../middlewares/auth.js";

const aiRouter = Router();

// Add debugging middleware
aiRouter.use((req, res, next) => {
  console.log(`[DEBUG] AI Route: ${req.method} ${req.path}`);
  next();
});
aiRouter.post("/generate-article", auth, generateArticle);

export default aiRouter;
