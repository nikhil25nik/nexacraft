import express from "express";
import { generateArticle, generateBlogTitle, generateImage, removeBackground, removeImageObject, reviewResume } from "../controllers/Ai.controllers.js";
import { upload } from "../config/multer.js";
import { authenticate } from "../middleware/userAuth.js";

const AiRouter = express.Router();

AiRouter.use(authenticate)
AiRouter.post("/generate-article",generateArticle)
AiRouter.post("/generate-blog-title",generateBlogTitle)
AiRouter.post("/generate-image",generateImage)
AiRouter.post("/remove-image-background",upload.single("image"),removeBackground)
AiRouter.post("/remove-image-object",upload.single("image"),removeImageObject)
AiRouter.post("/review-resume",upload.single("resume"),reviewResume)


export default AiRouter;