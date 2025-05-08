import { Router } from "express";
import { courseController } from "../controllers/index.js";

const controller = new courseController();

const router = Router();

router
  .post("/", controller.create)
  .get("/", controller.getAll)
  .get("/:id", controller.getOne)
  .put("/:id", controller.update)
  .delete("/:id", controller.delete);

export { router as courseRouter };
