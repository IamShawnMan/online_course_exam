import nodemailer from "nodemailer";
import { configuration } from "../config/env.config.js";

export const transporter = nodemailer.createTransport({
  port: configuration.smtp.port,
  host: configuration.smtp.host,
  auth: {
    user: configuration.smtp.user,
    pass: configuration.smtp.pass,
  },
  secure: true,
});
