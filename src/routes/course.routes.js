import { Router } from "express";
import { courseController, reviewController } from "../controllers/index.js";
import { authMiddleware, roleGuard } from "../middlewares/index.js";
import { configuration } from "../config/env.config.js";

const controller = new courseController();
const reviewCon = new reviewController();

const router = Router();

router
  .post(
    "/",
    authMiddleware,
    roleGuard(
      configuration.user.roles.superadmin,
      configuration.user.roles.admin,
      configuration.user.roles.author
    ),
    controller.create
  )
  .post(
    "/:id/enroll",
    authMiddleware,
    roleGuard(
      configuration.user.roles.superadmin,
      configuration.user.roles.admin,
      configuration.user.roles.user
    ),
    controller.enrollToCourse
  )
  .post(
    "/:id/review",
    authMiddleware,
    roleGuard(configuration.user.roles.user),
    reviewCon.create
  )
  .get("/", controller.getAll)
  .get("/:id", controller.getOne)
  .put(
    "/:id",
    authMiddleware,
    roleGuard(
      configuration.user.roles.superadmin,
      configuration.user.roles.admin
    ),
    controller.update
  )
  .delete(
    "/:id",
    authMiddleware,
    roleGuard(
      configuration.user.roles.superadmin,
      configuration.user.roles.admin
    ),
    controller.delete
  );

export { router as courseRouter };
