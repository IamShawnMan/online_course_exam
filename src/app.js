import express from "express";
import { catchError } from "./utils/catchError.js";
import { userRouter } from "./routes/user.routes.js";

const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);

app.use(catchError);

export default app;
