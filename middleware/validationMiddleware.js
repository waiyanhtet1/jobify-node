import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("Company name is required!"),
  body("position").notEmpty().withMessage("Position is required!"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status value!"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid job type!"),
  body("jobLocation").notEmpty().withMessage("Job Location is required!"),
]);

export const validateParamId = withValidationErrors([
  param("id").custom(async (value) => {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) throw new BadRequestError("invalid MongoDB ID!");

    const job = await Job.findById(value);
    if (!job) throw new NotFoundError("no job found!");
  }),
]);

export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required!"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format!")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new BadRequestError("email already exit");
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),
  body("lastName").notEmpty().withMessage("Last Name is required!"),
  body("location").notEmpty().withMessage("location is required!"),
  // body("role").isIn(Object.values(USER_ROLE)).withMessage("Invalid user role!"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format!"),
  body("password").notEmpty().withMessage("password is required"),
]);
