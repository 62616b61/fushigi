const { hub } = require('./ws/server');

hub.listen(3000);
console.log('ws server is up')
