import { Course, Enrollment } from "../models/index.js";
import {
  courseValidator,
  courseUpdateValidator,
} from "../validations/index.js";
import { appError } from "../utils/catchError.js";
import { jsonResponse } from "../utils/response.js";
import { configuration } from "../config/env.config.js";

export class courseController {
  async enrollToCourse(req, res, next) {
    try {
      const { id } = req.params;

      const course = await Course.findById(id);
      if (!course) {
        throw new appError("Course not found", 404);
      }
      let user;
      if (
        req.user.role === configuration.user.roles.admin ||
        req.user.role === configuration.user.roles.superadmin
      ) {
        const { userId } = req.body;
        if (!userId) {
          throw new appError("Data is not defained", 404);
        }
        user = userId;
      }
      if (req.user.role === configuration.user.roles.user) {
        user = req.user.id;
      }
      const newEnrollment = new Enrollment({ userId: user, courseId: id });
      await newEnrollment.save();
      return jsonResponse(
        res,
        "Enrolled to course successfully",
        newEnrollment
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { error, value } = courseValidator(req.body);
      if (error) {
        throw new appError(error.message, 400);
      }
      const newCourse = new Course(value);
      await newCourse.save();
      return jsonResponse(res, "New course created", newCourse);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_, res, next) {
    try {
      const allCourses = await Course.find().populate("category author").exec();
      return jsonResponse(res, "All courses", allCourses);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id).populate("category author");
      if (!course) {
        throw new appError("Course not found", 404);
      }
      return jsonResponse(res, "Course by id", course);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);
      if (!course) {
        throw new appError("Course not found", 404);
      }
      const { error, value } = courseUpdateValidator(req.body);
      if (error) {
        throw new appError(error.message, 400);
      }
      const updatedCourse = await Course.findByIdAndUpdate(id, value, {
        new: true,
      });

      return jsonResponse(res, "Course updated", updatedCourse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);
      if (!course) {
        throw new appError("Course not found", 404);
      }
      await Course.findByIdAndDelete(id);
      return jsonResponse(res, "Course deleted", {});
    } catch (error) {
      next(error);
    }
  }
}
