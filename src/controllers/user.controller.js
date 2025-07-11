import { User } from "../models/index.js";
import {
  superAdminUserValidator,
  loginValidate,
  adminValidation,
  updateValidation,
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
import { jsonResponse } from "../utils/response.js";

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

      if (
        role != configuration.user.roles.superadmin &&
        role != configuration.user.roles.user
      ) {
        throw new appError("This role is not acceptible", 400); //If validation will not work this will not accept wrong roles
      } //The comment above written by myself not by ChatGPT

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

      return jsonResponse(res, `New user created`, newUser);
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

      return jsonResponse(res, `New admin created`, newUser);
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

      return jsonResponse(res, "Confirmation code sent to your email", {});
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

      return jsonResponse(res, "Loggen in successfully", {
        ...payload,
        token: accessToken,
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

      return jsonResponse(res, "All users", allUsers);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        throw new appError("User not found", 404);
      }

      return jsonResponse(res, "User by id", user);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        throw new appError("User not found", 404);
      }
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
        hashedPassword = await encode(password);
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

      return jsonResponse(res, "User updated successfully", updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        throw new appError("User not found", 404);
      }

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
      return jsonResponse(res, "User deleted", {});
    } catch (error) {
      next(error);
    }
  }
}
