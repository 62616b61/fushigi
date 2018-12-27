const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/proto/scheduler.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).scheduler;

const schedulerUrl = 'scheduler:3000';
const scheduler = new proto.Scheduler(schedulerUrl, grpc.credentials.createInsecure());

module.exports = {
  scheduler,
}
