import { configuration } from "../config/env.config.js";

export const otpMail = (data) => {
  const mail = {
    from: configuration.smtp.user,
    to: data.email,
    subject: "Confirmation password",
    text: `Your confirmation code is ${data.otp}`,
  };
  return mail;
};
