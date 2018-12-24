const { runner } = require('./ws/server');

runner.listen(3000);
console.log('ws server is up')
