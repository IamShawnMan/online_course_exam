import { connect } from "mongoose";
import { configuration } from "./env.config.js";

export const connectDB = async () => {
  try {
    await connect(configuration.db.uri);
    console.log("Database connected successfully...");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
