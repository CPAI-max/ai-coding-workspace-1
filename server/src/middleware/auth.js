import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";
import User from "../models/User.js";
import { jwtSecret } from "../config/env.js";

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.sub).select("_id name email");

    if (!user) {
      throw new ApiError(401, "Invalid session");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.status ? error : new ApiError(401, "Invalid session"));
  }
}
