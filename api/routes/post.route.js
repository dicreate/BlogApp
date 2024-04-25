import express from "express";
import { create } from "../conrollers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { getPosts } from "../conrollers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);

router.get("/getposts", getPosts);

export default router;
