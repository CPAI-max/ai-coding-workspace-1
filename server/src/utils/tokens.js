import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env.js";

export function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email
    },
    jwtSecret,
    { expiresIn: "7d" }
  );
}
