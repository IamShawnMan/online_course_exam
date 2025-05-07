import { configuration } from "./config/env.config.js";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = configuration.port;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

start();
