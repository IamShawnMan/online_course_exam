import { connect } from "mongoose";
import { configuration } from "./env.config.js";
import { logger } from "../utils/logger/logger.js";

export const connectDB = async () => {
  try {
    await connect(configuration.db.uri);
    logger.info("Database connected successfully...");
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};
