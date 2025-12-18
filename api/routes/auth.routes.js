import express from "express"
import { googleLogin, login, logout, register } from "../controllers/Auth.controllers.js";
import { authenticate } from "../middleware/userAuth.js";

const RouteAuth = express.Router();

RouteAuth.post("/register",register);
RouteAuth.post("/login",login);
RouteAuth.post("/google-login",googleLogin);
RouteAuth.get("/logout",authenticate,logout);

export default RouteAuth;