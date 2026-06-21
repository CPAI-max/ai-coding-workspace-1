import OpenAI from "openai";
import CodeFile from "../models/CodeFile.js";

function formatProjectContext(files) {
  return files
    .map((file) => `FILE: ${file.path}\nLANGUAGE: ${file.language}\n---\n${file.content}`)
    .join("\n\n");
}

function parseFallbackOperation(message) {
  const createOrUpdate = message.match(/^(create|update)\s+file\s+(.+?)\s+with\s+([\s\S]+)$/i);
  if (createOrUpdate) {
    return {
      type: createOrUpdate[1].toLowerCase() === "create" ? "upsert" : "update",
      path: createOrUpdate[2].trim(),
      content: createOrUpdate[3].trim()
    };
  }

  const remove = message.match(/^delete\s+file\s+(.+)$/i);
  if (remove) {
    return {
      type: "delete",
      path: remove[1].trim()
    };
  }

  return null;
}

async function applyOperations(project, operations) {
  const applied = [];

  for (const operation of operations) {
    if (!operation.path) continue;

    if (operation.type === "delete") {
      const result = await CodeFile.deleteOne({ project: project._id, path: operation.path });
      if (result.deletedCount) {
        applied.push(`Deleted ${operation.path}`);
      }
      continue;
    }

    const update = {
      content: operation.content || "",
      language: operation.language || undefined
    };

    Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

    await CodeFile.findOneAndUpdate(
      { project: project._id, path: operation.path },
      { $set: update, $setOnInsert: { project: project._id, path: operation.path } },
      { upsert: true, new: true }
    );
    applied.push(`${operation.type === "update" ? "Updated" : "Saved"} ${operation.path}`);
  }

  return applied;
}

async function fallbackReply(project, message, files) {
  const operation = parseFallbackOperation(message);
  const operations = operation ? [operation] : [];
  const applied = await applyOperations(project, operations);

  if (applied.length) {
    return {
      content: `${applied.join(", ")}. I used your instruction as the new file content.`,
      operationsApplied: applied
    };
  }

  const fileList = files.map((file) => `- ${file.path} (${file.language}, ${file.content.length} chars)`).join("\n");
  return {
    content:
      `I inspected ${files.length} project file${files.length === 1 ? "" : "s"}.\n\n${fileList || "No files yet."}\n\n` +
      "Ask me about a specific file, or use commands like `update file index.js with ...` for basic file edits.",
    operationsApplied: []
  };
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }
}

export async function answerProjectQuestion(project, message) {
  const files = await CodeFile.find({ project: project._id }).sort({ path: 1 });

  if (!process.env.OPENAI_API_KEY) {
    return fallbackReply(project, message, files);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an AI coding assistant inside a project workspace. Return JSON with keys content and operations. " +
          "operations is an array of file operations: {type:'upsert'|'update'|'delete', path, language, content}. " +
          "Only include operations when the user asks you to modify files."
      },
      {
        role: "user",
        content: `Project: ${project.name}\nWorkspace: ${project.workspace}\n\n${formatProjectContext(files)}\n\nUser request: ${message}`
      }
    ]
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const parsed = safeParseJson(raw) || {};
  const operations = Array.isArray(parsed.operations) ? parsed.operations : [];
  const applied = await applyOperations(project, operations);

  return {
    content: parsed.content || "I reviewed the project and did not find a specific change to make.",
    operationsApplied: applied
  };
}
