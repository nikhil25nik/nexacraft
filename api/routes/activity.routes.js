import express from "express"
import { getPublishedCreations, getUserCreations, toggleLikeCreation } from "../controllers/Activity.controllers.js"
import { authenticate } from "../middleware/userAuth.js";

const ActivityRoute = express.Router()
ActivityRoute.use(authenticate)
ActivityRoute.get("/get-user-creation/:userId",getUserCreations);
ActivityRoute.get("/get-published-creation",getPublishedCreations);
ActivityRoute.post("/toggle-like-creation",toggleLikeCreation);

export default ActivityRoute;