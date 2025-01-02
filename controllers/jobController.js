import Job from "../models/jobModel.js";

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({});
  res.status(200).json({ jobs });
};

export const createJob = async (req, res) => {
  const newJob = await Job.create(req.body);
  res.status(201).json({
    message: "new job created!",
    data: newJob,
  });
};

export const getSingleJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  res.status(200).json({ job });
};

export const editJob = async (req, res) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({ message: "job modified", updatedJob });
};

export const deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "job deleted!" });
};
