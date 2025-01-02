import { Router } from "express";
import {
  createJob,
  deleteJob,
  editJob,
  getAllJobs,
  getSingleJob,
} from "../controllers/jobController.js";
import {
  validateJobInput,
  validateParamId,
} from "../middleware/validationMiddleware.js";

const router = Router();

router.route("/").get(getAllJobs).post(validateJobInput, createJob);
router
  .route("/:id")
  .get(validateParamId, getSingleJob)
  .patch(validateParamId, validateJobInput, editJob)
  .delete(validateParamId, deleteJob);

export default router;
