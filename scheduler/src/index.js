const { scheduler } = require('./grpc/server');

scheduler.start();
console.log('Scheduler grpc server is up');
