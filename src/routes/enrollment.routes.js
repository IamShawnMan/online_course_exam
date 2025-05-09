import { Router } from "express";
import { EnrollmentController } from "../controllers/index.js";
import { authMiddleware, roleGuard } from "../middlewares/index.js";
import { configuration } from "../config/env.config.js";

const controller = new EnrollmentController();

const router = Router();

router
  .get(
    "/",
    authMiddleware,
    roleGuard(
      configuration.user.roles.admin,
      configuration.user.roles.superadmin
    ),
    controller.getAll
  )
  .get(
    "/:id",
    authMiddleware,
    roleGuard(
      configuration.user.roles.admin,
      configuration.user.roles.superadmin,
      "self"
    ),
    controller.getOne
  )
  .put(
    "/:id",
    authMiddleware,
    roleGuard(
      configuration.user.roles.admin,
      configuration.user.roles.superadmin
    ),
    controller.update
  )
  .delete(
    "/:id",
    authMiddleware,
    roleGuard(
      configuration.user.roles.admin,
      configuration.user.roles.superadmin
    ),
    controller.delete
  );

export { router as enrollmentRouter };
