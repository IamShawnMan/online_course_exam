import express from "express";
import { catchError } from "./utils/catchError.js";
import {
  userRouter,
  categoryRouter,
  courseRouter,
  enrollmentRouter,
} from "./routes/index.js";

const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/enrollment", enrollmentRouter);

app.use(catchError);

export default app;
