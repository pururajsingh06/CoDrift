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

const makeWandboxRequest = (payload) => {
  return new Promise((resolve) => {
    const dataString = JSON.stringify(payload);
    
    const options = {
      hostname: "wandbox.org",
      path: "/api/compile.json",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": dataString.length,
      },
      timeout: 15000,
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          const hasError = parsed.status !== "0" && parsed.status !== 0;
          if (!hasError) {
            resolve(parsed.program_output || parsed.program_error || "No output");
          } else {
            resolve(parsed.program_error || parsed.compiler_error || parsed.program_output || "Execution failed");
          }
        } catch {
          resolve("Failed to parse Wandbox compilation result.");
        }
      });
    });

    req.on("error", (err) => {
      resolve(`Wandbox execution error: ${err.message}`);
    });

    req.on("timeout", () => {
      req.destroy();
      resolve("Wandbox execution timed out.");
    });

    req.write(dataString);
    req.end();
  });
};

const runWandbox = async (files, mainFile) => {
  const ext = path.extname(mainFile).toLowerCase().replace('.', '');
  
  const wandboxCompilers = {
    py: "cpython-head",
    cpp: "gcc-head",
    c: "gcc-head",
    java: "openjdk-head",
    js: "nodejs-head"
  };

  const compiler = wandboxCompilers[ext] || wandboxCompilers['js'];
  const mainFileContent = files[mainFile] || "";
  
  const secondaryFiles = Object.keys(files)
    .filter(name => name !== mainFile)
    .map(name => ({
      file: path.basename(name),
      code: files[name]
    }));

  const payload = {
    compiler,
    code: mainFileContent,
    codes: secondaryFiles,
    stdin: "",
    save: false
  };

  return await makeWandboxRequest(payload);
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
          const wandboxOutput = await runWandbox(files, mainFile);
          return resolve(wandboxOutput);
        }
        return resolve(stderr || err.message);
      }
      resolve(stdout || stderr || "No output");
    });
  });
};

module.exports = { runCode };
