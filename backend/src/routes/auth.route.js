import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { login, logout, signup,updateProfile ,checkAuth} from "../controllers/auth.controller.js";

const router = express.Router();
// we can also use get method but post is more appropriate as we are posting some info on the server rather than extracting something
// the functions for signup login and logout written in controllers

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,checkAuth);
export default router;