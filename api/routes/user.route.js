import express from "express";
import { test } from "../conrollers/user.controller.js";
import { updateUser } from "../conrollers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { deleteUser } from "../conrollers/user.controller.js";
import { signout } from "../conrollers/user.controller.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);

export default router;
