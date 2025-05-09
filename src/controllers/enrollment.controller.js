import { Enrollment } from "../models/index.js";
import { appError } from "../utils/catchError.js";
import { jsonResponse } from "../utils/response.js";

export class EnrollmentController {
  async getAll(_, res, next) {
    try {
      const allEnrollments = await Enrollment.find()
        .populate("userId courseId")
        .exec();
      return jsonResponse(res, "All enrollments", allEnrollments);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const enrollment = await Enrollment.findById(id)
        .populate("userId courseId")
        .exec();
      if (!enrollment) {
        throw new appError("Enrollment not found", 404);
      }
      return jsonResponse(res, "Enrollment by id", enrollment);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const enrollment = await Enrollment.findById(id);
      if (!enrollment) {
        throw new appError("Enrollment not found", 404);
      }
      const { courseId } = req.body;
      const updatedEnrollment = await Enrollment.findByIdAndUpdate(
        id,
        { courseId },
        { new: true }
      );
      return jsonResponse(res, "Enrollment updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const enrollment = await Enrollment.findById(id);
      if (!enrollment) {
        throw new appError("Enrollment not found", 404);
      }
      await Enrollment.findByIdAndDelete(id);
      return jsonResponse(res, "Enrollment deleted", {});
    } catch (error) {
      next(error);
    }
  }
}
