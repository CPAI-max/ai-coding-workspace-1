import { z } from "zod";
import ChatMessage from "../models/ChatMessage.js";
import CodeFile from "../models/CodeFile.js";
import Project from "../models/Project.js";
import { ApiError } from "../middleware/errorHandler.js";
import { answerProjectQuestion } from "../services/aiService.js";
import { defaultFilesFor, languageFromPath } from "../utils/fileDefaults.js";

const projectSchema = z.object({
  name: z.string().min(1).max(120),
  workspace: z.enum(["javascript", "python", "website"]),
  description: z.string().max(500).optional().default("")
});

const fileSchema = z.object({
  path: z.string().min(1).max(240).refine((value) => !value.includes(".."), "Invalid file path"),
  content: z.string().optional().default(""),
  language: z.string().optional()
});

const chatSchema = z.object({
  message: z.string().min(1).max(8000)
});

export async function listProjects(req, res, next) {
  try {
    const filter = { owner: req.user._id };
    if (req.query.workspace) {
      filter.workspace = req.query.workspace;
    }

    const projects = await Project.find(filter).sort({ updatedAt: -1 });
    res.json({ projects });
  } catch (error) {
    next(error);
  }
}

export async function createProject(req, res, next) {
  try {
    const data = projectSchema.parse(req.body);
    const project = await Project.create({ ...data, owner: req.user._id });
    const files = await CodeFile.insertMany(
      defaultFilesFor(data.workspace).map((file) => ({ ...file, project: project._id }))
    );

    res.status(201).json({ project, files });
  } catch (error) {
    next(error);
  }
}

export async function getProject(req, res, next) {
  try {
    const files = await CodeFile.find({ project: req.project._id }).sort({ path: 1 });
    const chat = await ChatMessage.find({ project: req.project._id }).sort({ createdAt: 1 }).limit(100);
    res.json({ project: req.project, files, chat });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req, res, next) {
  try {
    await CodeFile.deleteMany({ project: req.project._id });
    await ChatMessage.deleteMany({ project: req.project._id });
    await req.project.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function createFile(req, res, next) {
  try {
    const data = fileSchema.parse(req.body);
    const file = await CodeFile.create({
      project: req.project._id,
      path: data.path,
      language: data.language || languageFromPath(data.path, req.project.workspace),
      content: data.content
    });

    await req.project.updateOne({ updatedAt: new Date() });
    res.status(201).json({ file });
  } catch (error) {
    if (error.code === 11000) {
      next(new ApiError(409, "A file with that path already exists"));
      return;
    }
    next(error);
  }
}

export async function updateFile(req, res, next) {
  try {
    const data = fileSchema.partial({ path: true }).parse(req.body);
    const file = await CodeFile.findOne({ _id: req.params.fileId, project: req.project._id });

    if (!file) {
      throw new ApiError(404, "File not found");
    }

    if (data.path) file.path = data.path;
    if (data.language) file.language = data.language;
    if (typeof data.content === "string") file.content = data.content;
    await file.save();
    await req.project.updateOne({ updatedAt: new Date() });

    res.json({ file });
  } catch (error) {
    next(error);
  }
}

export async function deleteFile(req, res, next) {
  try {
    const result = await CodeFile.deleteOne({ _id: req.params.fileId, project: req.project._id });

    if (!result.deletedCount) {
      throw new ApiError(404, "File not found");
    }

    await req.project.updateOne({ updatedAt: new Date() });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function listChat(req, res, next) {
  try {
    const chat = await ChatMessage.find({ project: req.project._id }).sort({ createdAt: 1 }).limit(100);
    res.json({ chat });
  } catch (error) {
    next(error);
  }
}

export async function sendChat(req, res, next) {
  try {
    const { message } = chatSchema.parse(req.body);
    const userMessage = await ChatMessage.create({
      project: req.project._id,
      role: "user",
      content: message
    });

    const answer = await answerProjectQuestion(req.project, message);
    const assistantMessage = await ChatMessage.create({
      project: req.project._id,
      role: "assistant",
      content: answer.content
    });
    const files = await CodeFile.find({ project: req.project._id }).sort({ path: 1 });

    res.status(201).json({
      messages: [userMessage, assistantMessage],
      operationsApplied: answer.operationsApplied,
      files
    });
  } catch (error) {
    next(error);
  }
}
