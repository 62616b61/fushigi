var PROTO_PATH = __dirname + '/../proto/test.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var dataProto = grpc.loadPackageDefinition(packageDefinition).main;

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
