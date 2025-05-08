import { Category } from "../models/category.model.js";
import {
  categoryValidator,
  categoryUpdateValidator,
} from "../validations/index.js";
import { appError } from "../utils/catchError.js";
import { jsonResponse } from "../utils/response.js";

export class categoryController {
  async create(req, res, next) {
    try {
      const { error, value } = categoryValidator(req.body);
      if (error) {
        throw new appError(error.message, 400);
      }
      const newCategory = new Category(value);
      await newCategory.save();

      return jsonResponse(res, "New category created", newCategory);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_, res, next) {
    try {
      const allCategories = await Category.find();
      return jsonResponse(res, "All categories", allCategories);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        throw new appError("Category not found", 404);
      }
      return jsonResponse(res, "Category by id", category);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        throw new appError("Category not found", 404);
      }
      const { error, value } = categoryUpdateValidator(req.body);
      if (error) {
        throw new appError(error.message, 400);
      }
      const updatedCategory = await Category.findByIdAndUpdate(id, value, {
        new: true,
      });
      return jsonResponse(res, "Category updated", updatedCategory);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        throw new appError("Category not found", 404);
      }
      await Category.findByIdAndDelete(id);
      return jsonResponse(res, "Category deleted", {});
    } catch (error) {
      next(error);
    }
  }
}
