const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/../proto/test.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const dataProto = grpc.loadPackageDefinition(packageDefinition).main;

const controllerHost = process.env.CONTROLLER_SERVICE_HOST;
const controllerPort = process.env.CONTROLLER_SERVICE_PORT;
const controllerUrl = `${controllerHost}:${controllerPort}`;

const client = new dataProto.DataService(controllerUrl, grpc.credentials.createInsecure());

client.getData({}, (err, response) => {
  console.log('getData:', response, err)
});

// dont die
setInterval(() => {}, 100000);
