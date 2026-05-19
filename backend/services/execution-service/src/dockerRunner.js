const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const https = require("https");

const TEMP_DIR = path.join(__dirname, "../../temp");

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

const LANG_CONFIG = {
  js: {
    image: 'node:18-alpine',
    execCmd: (file) => `node ${file}`,
  },
  py: {
    image: 'python:3.9-slim',
    execCmd: (file) => `python ${file}`,
  },
  cpp: {
    image: 'gcc:latest',
    execCmd: (file) => `sh -c "g++ -o prog ${file} && ./prog"`,
  },
  c: {
    image: 'gcc:latest',
    execCmd: (file) => `sh -c "gcc -o prog ${file} && ./prog"`,
  },
  java: {
    image: 'openjdk:17-slim',
    execCmd: (file) => `java ${file}`,
  }
};

const PISTON_LANG_MAP = {
  js: 'javascript',
  py: 'python',
  cpp: 'c++',
  c: 'c',
  java: 'java',
  ts: 'typescript',
  rs: 'rust',
  go: 'go'
};

const runCode = async (files, mainFile) => {
  const isDockerActive = await checkDocker();
  const ext = path.extname(mainFile).toLowerCase().replace('.', '');
  
  if (!isDockerActive) {
    return new Promise((resolve) => {
      const lang = PISTON_LANG_MAP[ext] || 'javascript';
      
      const payload = {
        language: lang,
        version: "*",
        files: Object.keys(files).map(name => ({
          name: name,
          content: files[name]
        }))
      };

      const postData = JSON.stringify(payload);
      const options = {
        hostname: 'emkc.org',
        port: 443,
        path: '/api/v2/piston/execute',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      
      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', chunk => responseBody += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(responseBody);
            resolve(data.run ? (data.run.output || data.run.stdout || data.run.stderr) : data.message || "Execution failed on remote server.");
          } catch (e) {
            resolve("Error parsing response from remote execution server.");
          }
        });
      });
      
      req.on('error', (e) => resolve(`Remote execution error: ${e.message}`));
      req.write(postData);
      req.end();
    });
  }
  
  return new Promise((resolve) => {
    const workspaceId = `workspace-${Date.now()}`;
    const workspacePath = path.join(TEMP_DIR, workspaceId);

    fs.mkdirSync(workspacePath, { recursive: true });

    Object.keys(files).forEach((fileName) => {
      const safeFileName = path.basename(fileName);
      fs.writeFileSync(path.join(workspacePath, safeFileName), files[fileName]);
    });

    const config = LANG_CONFIG[ext] || LANG_CONFIG['js'];
    const safeMainFile = path.basename(mainFile);

    const volumePath = workspacePath.replace(/\\/g, "/");
    const execCmd = config.execCmd(safeMainFile);
    const command = `docker run --rm -v ${volumePath}:/app -w /app ${config.image} ${execCmd}`;

    exec(command, { timeout: 10000, cwd: workspacePath }, (err, stdout, stderr) => {
      try { fs.rmSync(workspacePath, { recursive: true, force: true }); } catch {}

      if (err) return resolve(stderr || err.message);
      resolve(stdout || stderr || "No output");
    });
  });
};

module.exports = { runCode };