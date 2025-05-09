import { Router } from "express";
import { courseController, reviewController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/auth.guard.js";

const controller = new courseController();
const reviewCon = new reviewController();

const router = Router();

router
  .post("/", controller.create)
  .post("/:id/enroll", authMiddleware, controller.enrollToCourse)
  .post("/:id/review", reviewCon.create)
  .get("/", controller.getAll)
  .get("/:id", controller.getOne)
  .put("/:id", controller.update)
  .delete("/:id", controller.delete);

export { router as courseRouter };
