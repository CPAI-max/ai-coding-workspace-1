import bcrypt from "bcryptjs";
import { z } from "zod";
import User from "../models/User.js";
import { ApiError } from "../middleware/errorHandler.js";
import { signToken } from "../utils/tokens.js";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const signupSchema = authSchema.extend({
  name: z.string().min(2).max(80)
});

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
}

export async function signup(req, res, next) {
  try {
    const data = signupSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email });

    if (existing) {
      throw new ApiError(409, "Email is already registered");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash
    });

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const data = authSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });

    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new ApiError(401, "Invalid email or password");
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
