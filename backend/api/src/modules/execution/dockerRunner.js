const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const https = require("https");

const TEMP_DIR = path.join(__dirname, "temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const checkDocker = () => {
  return new Promise((resolve) => {
    exec("docker info", (err) => {
      resolve(!err);
    });
  });
};

const makePistonRequest = (payload) => {
  return new Promise((resolve) => {
    const dataString = JSON.stringify(payload);
    
    const options = {
      hostname: "emkc.org",
      path: "/api/v2/piston/execute",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": dataString.length,
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.run) {
            resolve(parsed.run.stdout || parsed.run.stderr || "No output");
          } else {
            resolve(parsed.message || "Execution failed");
          }
        } catch {
          resolve("Failed to parse compilation result.");
        }
      });
    });

    req.on("error", (err) => {
      resolve(`Execution error: ${err.message}`);
    });

    req.on("timeout", () => {
      req.destroy();
      resolve("Execution timed out.");
    });

    req.write(dataString);
    req.end();
  });
};

const runPiston = async (files, mainFile) => {
  const ext = path.extname(mainFile).toLowerCase().replace('.', '');
  
  const pistonLanguages = {
    js: { language: "javascript", version: "18.15.0" },
    py: { language: "python", version: "3.10.0" },
    cpp: { language: "c++", version: "10.2.0" },
    c: { language: "c", version: "10.2.0" },
    java: { language: "java", version: "15.0.2" }
  };

  const config = pistonLanguages[ext] || pistonLanguages['js'];
  
  const pistonFiles = Object.keys(files).map(name => ({
    name: path.basename(name),
    content: files[name]
  }));

  const payload = {
    language: config.language,
    version: config.version,
    files: pistonFiles,
    stdin: ""
  };

  return await makePistonRequest(payload);
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
  
  if (isDockerActive) {
    return new Promise((resolve) => {
      const workspaceId = `workspace-${Date.now()}`;
      const workspacePath = path.join(TEMP_DIR, workspaceId);

      fs.mkdirSync(workspacePath, { recursive: true });

      Object.keys(files).forEach((fileName) => {
        const safeFileName = path.basename(fileName);
        fs.writeFileSync(path.join(workspacePath, safeFileName), files[fileName]);
      });

      const ext = path.extname(mainFile).toLowerCase().replace('.', '');
      const config = LANG_CONFIG[ext] || LANG_CONFIG['js'];
      const safeMainFile = path.basename(mainFile);

      const volumePath = workspacePath.replace(/\\/g, "/");
      const execCmd = config.execCmd(safeMainFile);
      const command = `docker run --rm -v ${volumePath}:/app -w /app ${config.image} ${execCmd}`;

      exec(command, { timeout: 5000, cwd: workspacePath }, (err, stdout, stderr) => {
        try { fs.rmSync(workspacePath, { recursive: true, force: true }); } catch {}
        if (err) return resolve(stderr || err.message);
        resolve(stdout || stderr || "No output");
      });
    });
  }

  // Fallback chain: local execution -> Piston API fallback
  return new Promise((resolve) => {
    const workspaceId = `workspace-${Date.now()}`;
    const workspacePath = path.join(TEMP_DIR, workspaceId);

    fs.mkdirSync(workspacePath, { recursive: true });

    Object.keys(files).forEach((fileName) => {
      const safeFileName = path.basename(fileName);
      fs.writeFileSync(path.join(workspacePath, safeFileName), files[fileName]);
    });

    const ext = path.extname(mainFile).toLowerCase().replace('.', '');
    const config = LANG_CONFIG[ext] || LANG_CONFIG['js'];
    const safeMainFile = path.basename(mainFile);
    const command = config.localCmd(safeMainFile);

    exec(command, { timeout: 5000, cwd: workspacePath }, async (err, stdout, stderr) => {
      try { fs.rmSync(workspacePath, { recursive: true, force: true }); } catch {}

      if (err) {
        const errMsg = (stderr || err.message).toLowerCase();
        // Check if the compilation binary or language runtime was missing
        if (
          errMsg.includes("not found") || 
          errMsg.includes("not recognized") || 
          err.code === "ENOENT" ||
          err.code === 127
        ) {
          const pistonOutput = await runPiston(files, mainFile);
          return resolve(pistonOutput);
        }
        return resolve(stderr || err.message);
      }
      resolve(stdout || stderr || "No output");
    });
  });
};

module.exports = { runCode };
