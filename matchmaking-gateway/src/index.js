const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('Started server')

wss.on('connection', function connection(ws) {
  console.log('new connection')
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
 
  ws.send('something');
});
