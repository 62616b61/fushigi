
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const spawnGameRunner = require('../controllers/spawnGameRunner.controller');

const PROTO_PATH = __dirname + '/../../proto/scheduler.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).scheduler;

const scheduler = new grpc.Server();
scheduler.addService(
  proto.Scheduler.service,
  {
    SpawnGameRunner: spawnGameRunner,
  }
);
scheduler.bind('0.0.0.0:3000', grpc.ServerCredentials.createInsecure());

module.exports = {
  scheduler,
}
