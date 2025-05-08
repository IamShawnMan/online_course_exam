import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 30,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.virtual("Course", {
  ref: "Course",
  localField: "_id",
  foreignField: "category",
});

export const Category = model("Category", categorySchema);
