import { UnauthenticatedError } from "../errors/customErrors.js";
import User from "../models/userModel.js";
import { createJWT } from "../utils/jwtUtils.js";
import { comparePassword, hashedPassword } from "../utils/passwordUtils.js";

export const register = async (req, res) => {
  // creating fist user account is admin level because due to this project requirement there is only one admin user
  //  and other remaining register user are always be user level
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  req.body.password = await hashedPassword(req.body.password);

  await User.create(req.body);
  res.status(201).send({ message: "success!" });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new UnauthenticatedError("No User found with this email!");

  const isPassCorrect = await comparePassword(req.body.password, user.password);
  if (!isPassCorrect) throw new UnauthenticatedError("Wrong Password");

  const token = createJWT({ userId: user._id, role: user.role });

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Login Success!", token });
};
