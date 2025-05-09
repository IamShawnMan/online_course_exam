import { Router } from "express";
import { reviewController } from "../controllers/index.js";
import { authMiddleware, roleGuard } from "../middlewares/index.js";
import { configuration } from "../config/env.config.js";

const controller = new reviewController();
const router = Router();

router
  .get("/", controller.getAll)
  .get("/:id", controller.getById)
  .put(
    "/:id",
    authMiddleware,
    roleGuard(configuration.user.roles.superadmin),
    controller.update
  )
  .delete(
    "/:id",
    authMiddleware,
    roleGuard(configuration.user.roles.superadmin),
    controller.delete
  );

export { router as reviewRouter };
