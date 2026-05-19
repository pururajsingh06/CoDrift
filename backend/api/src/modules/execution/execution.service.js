const { runCode } = require("./dockerRunner");

class ExecutionService {
  async execute(files, mainFile) {
    return await runCode(files, mainFile);
  }
}

module.exports = new ExecutionService();