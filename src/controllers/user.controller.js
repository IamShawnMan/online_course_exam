import { User } from "../models/index.js";
import {
  superAdminUserValidator,
  loginValidate,
} from "../validations/index.js";
import { appError } from "../utils/catchError.js";
import { encode, decode } from "../utils/encode-decode.js";
import { configuration } from "../config/env.config.js";

export class UserController {
  async create(req, res, next) {
    try {
      const { error, value } = superAdminUserValidator(req.body);

      if (error) {
        throw new appError("Data validation failed", 400);
      }

      const { fullName, email, password, role } = value;

      const existUser = await User.findOne({ email });

      if (existUser) {
        throw new appError("User with this emil is already exist", 400);
      }

      if (
        role !== configuration.user.roles.superadmin ||
        role !== configuration.user.roles.user
      ) {
        throw new appError("Wrong role", 400);
      }

      if (role === configuration.user.roles.superadmin) {
        const isSuperadmin = await User.findOne({
          role: configuration.user.roles.superadmin,
        });
        if (isSuperadmin) {
          throw new appError("Super admin exist or invalid role", 400);
        }
      }

      const hashedPassword = await encode(password);

      const newUser = new User({
        fullName,
        email,
        role,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({
        status: "success",
        message: `Super admin created`,
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAdmin(req, res, next) {
    try {
      const { error, value } = userCreateValidation(req.body);

      if (error) {
        throw new appError("Data validation failed", 400);
      }

      const { fullName, email, password, role } = value;

      const existUser = await User.findOne({ email });

      if (existUser) {
        throw new appError("User with this emil is already exist", 400);
      }
      if (
        role === configuration.user.roles.superadmin ||
        role !== configuration.user.roles.admin
      ) {
        throw new appError("Wrong user role", 400);
      }

      const hashedPassword = await encode(password);

      const newUser = new User({
        fullName,
        email,
        role,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({
        status: "success",
        message: `New ${role} created`,
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const { error, value } = loginValidate(req.body);
      if (error) {
        throw new appError(error.message, 400);
      }
      const { email, password } = value;
      const user = await User.findOne({ email });

      if (!user) {
        throw new appError("Username or password incorrect", 400);
      }

      const isValidPassword = await decode(password, user.password);
      if (!isValidPassword) {
        throw new appError("Username or password incorrect", 400);
      }
    } catch (error) {
      next(error);
    }
  }
}
