import { Router } from "express";
import {
  createFile,
  createProject,
  deleteFile,
  deleteProject,
  getProject,
  listChat,
  listProjects,
  sendChat,
  updateFile
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";
import { loadOwnedProject } from "../middleware/projectAccess.js";

const router = Router();

router.use(requireAuth);
router.get("/", listProjects);
router.post("/", createProject);
router.get("/:projectId", loadOwnedProject, getProject);
router.delete("/:projectId", loadOwnedProject, deleteProject);
router.post("/:projectId/files", loadOwnedProject, createFile);
router.patch("/:projectId/files/:fileId", loadOwnedProject, updateFile);
router.delete("/:projectId/files/:fileId", loadOwnedProject, deleteFile);
router.get("/:projectId/chat", loadOwnedProject, listChat);
router.post("/:projectId/chat", loadOwnedProject, sendChat);

export default router;
