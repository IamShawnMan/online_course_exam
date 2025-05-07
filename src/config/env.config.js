import { config } from "dotenv";
config();

export const configuration = {
  db: {
    uri: process.env.DB_URI,
  },
  port: process.env.PORT,
  user: {
    roles: {
      superadmin: "superadmin",
      admin: "admin",
      user: "user",
      author: "author",
    },
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  token: {
    accSec: process.env.ACCESS_TOKEN_SECRET,
    accTime: process.env.ACCESS_TOKEN_TIME,
    refSec: process.env.REFRESH_TOKEN_SECRET,
    refTime: process.env.REFRESH_TOKEN_TIME,
  },
};
