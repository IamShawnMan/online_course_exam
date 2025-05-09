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

export const enrolledMail = (data) => {
  const mail = {
    from: configuration.smtp.user,
    to: data.email,
    subject: "Congrats with your new enrollment",
    text: `Dear ${data.name} we announce you that you have succesfully enrolled to our ${data.course} course`,
  };
  return mail;
};
