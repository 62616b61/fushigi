const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/../proto/test.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const dataProto = grpc.loadPackageDefinition(packageDefinition).main;

function getData(call, callback) {
  callback(
    null,
    {
      id: 501,
      name: 'Alex',
    },
  );
}

var server = new grpc.Server();
server.addService(dataProto.DataService.service, {getData: getData});
server.bind('0.0.0.0:3000', grpc.ServerCredentials.createInsecure());
server.start();

console.log('grpc server is running');
