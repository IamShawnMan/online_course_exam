import { configuration } from "../config/env.config.js";
import { appError } from "../utils/catchError.js";

export const roleGuard = (...roles) => {
  return (req, _, next) => {
    try {
      if (roles.length === 0) {
        throw new appError("Role does not exist", 404);
      }
      const user = req?.user;
      if (roles.includes("self")) {
        if (roles.includes(user.role) || user.id === req.params?.id) {
          next();
        } else {
          throw new appError("Forbidden user", 403);
        }
      }
      if (!roles.includes(req.user.role)) {
        throw new appError("Forbidden user", 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
