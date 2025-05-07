import { Router } from "express";
import { UserController } from "../controllers/index.js";

const router = Router();
const controller = new UserController();

router.post("/register/super", controller.createSuperAdmin);

export { router as userRouter };
