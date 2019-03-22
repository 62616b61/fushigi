const { hub } = require('./ws/server');
const { runsInKubernetes } = require('./config');

hub.listen(3000);
console.log('ws server is up')
