const { runCode } = require("../../../../services/execution-service/src/dockerRunner");

class ExecutionService {
  async execute(files, mainFile) {
    return await runCode(files, mainFile);
  }
}

module.exports = new ExecutionService();