import { configuration } from "./config/env.config.js";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger/logger.js";

const port = configuration.port;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      logger.info(`Server started on port ${port}`);
    });
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

start();
