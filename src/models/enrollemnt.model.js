import { Schema, model } from "mongoose";

const enrollmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
  },
  {
    timestamps: true,
  }
);

export const Enrollment = model("Enrollment", enrollmentSchema);
