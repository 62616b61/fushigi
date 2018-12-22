const http = require('http');
const WebSocket = require('ws');
 
const hub = new http.createServer();
const wss = new WebSocket.Server({ server: hub });

wss.on('connection', ws => {
  console.log('WS', ws)
  ws.on('message', message => {
    console.log('received: %s', message);
  });

  ws.send('something');
});

module.exports = { hub };
