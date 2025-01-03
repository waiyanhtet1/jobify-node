import User from "../models/userModel.js";

export const register = async (req, res) => {
  // creating fist user account is admin level because due to this project requirement there is only one admin user
  //  and other remaining register user are always be user level
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  const newUser = await User.create(req.body);
  res.send({ message: "success!", newUser });
};

export const login = (req, res) => {
  res.send("login");
};
