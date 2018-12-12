var PROTO_PATH = __dirname + '/../proto/test.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var dataProto = grpc.loadPackageDefinition(packageDefinition).main;

const client = new dataProto.DataService('localhost:8080', grpc.credentials.createInsecure());

client.getData({}, (err, response) => {
  console.log('getData:', response, err)
});
