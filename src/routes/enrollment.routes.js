import { Router } from "express";
import { EnrollmentController } from "../controllers/index.js";

const controller = new EnrollmentController();

const router = Router();

router.get("/", controller.getAll);

export { router as enrollmentRouter };
