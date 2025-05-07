import { User } from "../models/index.js";
import {
  superAdminUserValidator,
  loginValidate,
  adminValidation,
} from "../validations/index.js";
import { appError } from "../utils/catchError.js";
import { encode, decode } from "../utils/encode-decode.js";
import { configuration } from "../config/env.config.js";
import { transporter } from "../utils/mailer.js";
import { otpGenerate } from "../utils/generateOtp.js";
import { otpMail } from "../utils/createMail.js";
import { setCache, getCache } from "../utils/cache.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { updateValidation } from "../validations/user.update.validation.js";

export class UserController {
  async create(req, res, next) {
    try {
      const { error, value } = superAdminUserValidator(req.body);

      if (error) {
        throw new appError(error.message, 400);
      }

      const { fullName, email, password, role } = value;

      const existUser = await User.findOne({ email });

      if (existUser) {
        throw new appError("User with this emil is already exist", 400);
      }

      // if (
      //   role != configuration.user.roles.superadmin ||
      //   role != configuration.user.roles.user
      // ) {
      //   throw new appError("This role is not acceptible", 400); //If validation will not work this will not accept wrong roles
      // }

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
        message: `New user created`,
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAdmin(req, res, next) {
    try {
      const { error, value } = adminValidation(req.body);

      if (error) {
        throw new appError(error.message, 400);
      }

      const { fullName, email, password } = value;

      const existUser = await User.findOne({ email });

      if (existUser) {
        throw new appError("User with this emil is already exist", 400);
      }

      const hashedPassword = await encode(password);

      const newUser = new User({
        fullName,
        email,
        role: configuration.user.roles.admin,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({
        status: "success",
        message: `New admin created`,
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

      const otp = otpGenerate();
      const data = {
        email: user.email,
        otp,
      };

      transporter.sendMail(otpMail(data), (err, info) => {
        if (err) {
          throw new appError("Error on sending mail", 400);
        } else {
          console.log(info);
          setCache(user.email, otp);
        }
      });

      res.json({
        status: "success",
        message: "Confirmation code sent to your email",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmSignIn(req, res, next) {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        throw new appError("User not found", 404);
      }

      const otpCache = getCache(email);

      if (!otpCache || otpCache != otp) {
        throw new appError("Otp expired", 400);
      }

      const payload = {
        id: user._id,
        name: user.fullName,
        role: user.role,
        email: user.email,
      };

      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: "success",
        message: "Loggen in successfully",
        data: {
          ...payload,
          token: accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_, res, next) {
    try {
      const allUsers = await User.find(
        {},
        "_id __v fullName email role createdAt updatedAt"
      );
      res.json({
        status: "success",
        message: "All users",
        data: allUsers,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserController.findUserById(id);
      res.json({
        status: "success",
        message: "User by id",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserController.findUserById(id);
      const { error, value } = updateValidation(req.body);
      if (error) {
        throw new appError("Data validation failed", 400);
      }
      const { email, password, role } = value;
      if (email) {
        const isExistEmail = await User.findOne({ email });
        if (isExistEmail && id != isExistEmail._id) {
          throw new appError("User with this email already exist", 409);
        }
      }
      let hashedPassword = user.password;
      if (password) {
        hashedPassword = encode(password);
      }
      if (role && role != user.role) {
        throw new appError("You can not change your role", 400);
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          ...value,
          password: hashedPassword,
        },
        { new: true }
      );

      res.json({
        status: "success",
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserController.findUserById(id);

      if (
        req.user.role === configuration.user.roles.admin &&
        (user.role === configuration.user.roles.superadmin ||
          user.role === configuration.user.roles.admin)
      ) {
        throw new appError(
          "You can not delete this user or you are tying to delete superadmin",
          400
        );
      }
      if (user.role === configuration.user.roles.superadmin) {
        throw new appError("Super admin cant be deleted");
      }
      await User.findByIdAndDelete(id);
      res.json({
        status: "success",
        message: "User deleted",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }

  static async findUserById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new appError("User not found", 404);
      }
      return user;
    } catch (error) {
      next(error);
    }
  }
}
