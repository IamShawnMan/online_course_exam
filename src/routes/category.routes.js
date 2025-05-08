import { Router } from "express";
import { categoryController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/auth.guard.js";
import { roleGuard } from "../middlewares/role.guard.js";
import { configuration } from "../config/env.config.js";

const controller = new categoryController();

const router = Router();

router
  .post(
    "/",
    authMiddleware,
    roleGuard(
      configuration.user.roles.superadmin,
      configuration.user.roles.admin
    ),
    controller.create
  )

  .get("/", controller.getAll)

  .get("/:id", controller.getOne)

  .put("/:id", controller.update)

  .delete("/:id", controller.delete);

export { router as categoryRouter };
