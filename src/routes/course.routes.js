import { Router } from "express";
import { courseController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/auth.guard.js";

const controller = new courseController();

const router = Router();

router
  .post("/", controller.create)
  .post("/:id/enroll", authMiddleware, controller.enrollToCourse)
  .get("/", controller.getAll)
  .get("/:id", controller.getOne)
  .put("/:id", controller.update)
  .delete("/:id", controller.delete);

export { router as courseRouter };
