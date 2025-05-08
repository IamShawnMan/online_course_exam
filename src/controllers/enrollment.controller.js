import { Enrollment } from "../models/index.js";
import { appError } from "../utils/catchError.js";
import { jsonResponse } from "../utils/response.js";

export class EnrollmentController {
  async getAll(req, res, next) {
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
    } catch (error) {
      next(error);
    }
  }
}
