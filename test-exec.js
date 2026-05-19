const { runCode } = require('./backend/services/execution-service/src/dockerRunner.js');
runCode({'index.js': 'console.log("Hello from test!");'}, 'index.js').then(console.log).catch(console.error);
