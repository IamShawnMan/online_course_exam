import { Router } from "express";
import { reviewController } from "../controllers/index.js";

const controller = new reviewController();
const router = Router();

router
  .get("/", controller.getAll)
  .get("/:id", controller.getById)
  .put("/:id", controller.update)
  .delete("/:id", controller.delete);
