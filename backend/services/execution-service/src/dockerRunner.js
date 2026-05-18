const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const TEMP_DIR = path.join(__dirname, "../../temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Check if Docker is available
const checkDocker = () => {
  return new Promise((resolve) => {
    exec("docker info", (err) => {
      resolve(!err);
    });
  });
};

const LANG_CONFIG = {
  js: {
    image: 'node:18-alpine',
    execCmd: (file) => `node ${file}`,
    localCmd: (file) => `node ${file}`
  },
  py: {
    image: 'python:3.9-slim',
    execCmd: (file) => `python ${file}`,
    localCmd: (file) => `python ${file}`
  },
  cpp: {
    image: 'gcc:latest',
    execCmd: (file) => `sh -c "g++ -o prog ${file} && ./prog"`,
    localCmd: (file) => {
      const isWin = process.platform === 'win32';
      const out = isWin ? 'prog.exe' : './prog';
      return `g++ -o prog ${file} && ${out}`;
    }
  },
  c: {
    image: 'gcc:latest',
    execCmd: (file) => `sh -c "gcc -o prog ${file} && ./prog"`,
    localCmd: (file) => {
      const isWin = process.platform === 'win32';
      const out = isWin ? 'prog.exe' : './prog';
      return `gcc -o prog ${file} && ${out}`;
    }
  },
  java: {
    image: 'openjdk:17-slim',
    execCmd: (file) => `java ${file}`,
    localCmd: (file) => `java ${file}`
  }
};

const runCode = async (files, mainFile) => {
  const isDockerActive = await checkDocker();
  
  return new Promise((resolve) => {
    const workspaceId = `workspace-${Date.now()}`;
    const workspacePath = path.join(TEMP_DIR, workspaceId);

    // Create unique workspace directory
    fs.mkdirSync(workspacePath, { recursive: true });

    // Write all files to the workspace
    Object.keys(files).forEach((fileName) => {
      // Basic security: prevent path traversal
      const safeFileName = path.basename(fileName);
      fs.writeFileSync(path.join(workspacePath, safeFileName), files[fileName]);
    });

    const ext = path.extname(mainFile).toLowerCase().replace('.', '');
    const config = LANG_CONFIG[ext] || LANG_CONFIG['js'];
    const safeMainFile = path.basename(mainFile);

    let command;
    let cwd = workspacePath;

    if (isDockerActive) {
      const volumePath = workspacePath.replace(/\\/g, "/");
      const execCmd = config.execCmd(safeMainFile);
      command = `docker run --rm -v ${volumePath}:/app -w /app ${config.image} ${execCmd}`;
    } else {
      command = config.localCmd(safeMainFile);
    }

    exec(command, { timeout: 5000, cwd }, (err, stdout, stderr) => {
      // Cleanup workspace
      try { fs.rmSync(workspacePath, { recursive: true, force: true }); } catch {}

      if (err) return resolve(stderr || err.message);
      resolve(stdout || stderr || "No output");
    });
  });
};

module.exports = { runCode };