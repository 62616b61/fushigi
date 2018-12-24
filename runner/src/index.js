const { runner } = require('./ws/server');

runner.listen(3001);
console.log('ws server is up')
