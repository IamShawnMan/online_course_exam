import { logger } from "./logger/logger.js";
export const jsonResponse = (res, message, data) => {
  logger.info(message, { type: "success" });
  return res.json({
    status: "success",
    message,
    data,
  });
};
