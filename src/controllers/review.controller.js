import { Course, Review } from "../models/index.js";
import { appError } from "../utils/catchError.js";
import {
  reviewValidator,
  reviewUpdateValidator,
} from "../validations/index.js";
import { jsonResponse } from "../utils/response.js";

export class reviewController {
  async create(req, res, next) {
    try {
      const { courseId } = req.params;
      const course = await Course.findById({ id: courseId });
      if (!course) {
        throw new appError("Course not found", 404);
      }
      const { error, value } = reviewValidator(req.body);
      if (error) {
        throw new appError(error.message, 400);
      }
      const { rate, comment } = value;
      const userId = req.user.id;

      const newReview = new Review({ userId, courseId, rate, comment });
      await newReview.save();

      return jsonResponse(res, "New review created", newReview);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_, res, next) {
    try {
      const allReviews = await Review.find();
      return jsonResponse(res, "All reviews", allReviews);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const review = await Review.findById(id);
      if (!review) {
        throw new appError("Review not found", 404);
      }
      return jsonResponse(res, "Review by id", review);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const review = await Review.findById(id);
      if (!review) {
        throw new appError("Review not found");
      }
      const { error, value } = reviewUpdateValidator(req.body);
      if (error) {
        throw new appError(error.message, 400);
      }
      const { rate, comment } = value;
      const updatedReview = await Review.findByIdAndUpdate(
        id,
        { rate, comment },
        { new: true }
      );
      return jsonResponse(res, "Review updated", updatedReview);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const review = await Review.findById(id);
      if (!review) {
        throw new appError("Review not found");
      }
      await Review.findByIdAndDelete(id);
      return jsonResponse(res, "Review deleted", {});
    } catch (error) {
      next(error);
    }
  }
}
