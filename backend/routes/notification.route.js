import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);

export default router;