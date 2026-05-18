const express = require("express");
const router = express.Router();
const executionService = require("./execution.service");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

router.post("/", async (req, res) => {
  const { code, files, mainFile } = req.body;

  if (!code && !files) {
    return res.status(400).json({ error: "Code or workspace files are required" });
  }

  const output = await executionService.execute(files || { [mainFile || "index.js"]: code }, mainFile || "index.js");

  res.json({ output });
});

router.post("/powershell", (req, res) => {
  const { command, cwd } = req.body;
  const cmd = command ? command.trim() : "";
  let currentCwd = cwd || process.cwd();

  if (!cmd) {
    return res.json({ output: "", cwd: currentCwd });
  }

  if (cmd.startsWith("cd ")) {
    const targetDir = cmd.substring(3).trim().replace(/['"]/g, "");
    let resolvedCwd = path.resolve(currentCwd, targetDir);

    if (fs.existsSync(resolvedCwd) && fs.lstatSync(resolvedCwd).isDirectory()) {
      return res.json({
        output: `Directory changed to: ${resolvedCwd}`,
        cwd: resolvedCwd
      });
    } else {
      return res.json({
        output: `Error: Directory does not exist: ${resolvedCwd}`,
        cwd: currentCwd
      });
    }
  }

  exec(`powershell.exe -Command "${cmd.replace(/"/g, '\\"')}"`, { cwd: currentCwd }, (error, stdout, stderr) => {
    let output = "";
    if (stdout) output += stdout;
    if (stderr) output += stderr;
    if (error && !stderr) output += error.message;

    res.json({ output, cwd: currentCwd });
  });
});

module.exports = router;