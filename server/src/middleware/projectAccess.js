import Project from "../models/Project.js";
import { ApiError } from "./errorHandler.js";

export async function loadOwnedProject(req, _res, next) {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
}
