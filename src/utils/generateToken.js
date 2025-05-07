import jwt from "jsonwebtoken";
import { configuration } from "../config/env.config.js";

export const generateAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      configuration.token.accSec,
      {
        algorithm: "HS512",
        expiresIn: configuration.token.accTime,
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const generateRefreshToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      configuration.token.refSec,
      {
        algorithm: "HS512",
        expiresIn: configuration.token.refTime,
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};
