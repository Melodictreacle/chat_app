import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar } from "../controllers/messgae.controller.js";
import { getMessages } from "../controllers/messgae.controller.js";
import { sendMessage } from "../controllers/messgae.controller.js";

const router=express.Router();

router.get("/users",protectRoute,getUsersForSidebar);
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessage);
export default router;