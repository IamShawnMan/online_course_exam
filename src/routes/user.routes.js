import { Router } from "express";
import { UserController } from "../controllers/index.js";
import { authMiddleware, roleGuard } from "../middlewares/index.js";
import { configuration } from "../config/env.config.js";

const router = Router();
const controller = new UserController();

router
  .post("/register", controller.create)
  .post(
    "/register/admin",
    authMiddleware,
    roleGuard(configuration.user.roles.superadmin),
    controller.createAdmin
  )
  .post("/login", controller.signIn)
  .post("/login/confirm", controller.confirmSignIn)
  .get(
    "/",
    authMiddleware,
    roleGuard(
      configuration.user.roles.superadmin,
      configuration.user.roles.admin
    ),
    controller.getAll
  )
  .get(
    "/:id",
    authMiddleware,
    roleGuard(
      configuration.user.roles.superadmin,
      configuration.user.roles.admin,
      "self"
    ),
    controller.getOne
  )
  .put(
    "/:id",
    authMiddleware,
    roleGuard(configuration.user.roles.superadmin, "self"),
    controller.update
  )
  .delete(
    "/:id",
    authMiddleware,
    roleGuard(
      configuration.user.roles.superadmin,
      configuration.user.roles.admin
    ),
    controller.deleteUser
  );

export { router as userRouter };
