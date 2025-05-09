import { Router } from "express";
import { EnrollmentController } from "../controllers/index.js";

const controller = new EnrollmentController();

const router = Router();

router
  .get("/", controller.getAll)
  .get("/:id", controller.getOne)
  .put("/:id", controller.update)
  .delete("/:id", controller.delete);

export { router as enrollmentRouter };
