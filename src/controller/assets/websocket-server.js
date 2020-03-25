/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const WebSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer(() => {});
const port = 8090;
const connections = [];

// http server
server.listen(port, () => { });

// websocket server on top
const wsServer = new WebSocketServer({
  httpServer: server,

});

const sendAll = (object) => {
  connections.forEach((connection) => {
    connection.sendUTF(JSON.stringify(object));
  });
};

console.log(`Websocket server listening on port ${port}`);
wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  connections.push(connection);
  // console.log(`Incoming websocket connection from ${connection.remoteAddress.split(':')[3]}`);

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      // console.log(JSON.parse(message).utf8Data);
      sendAll(message.utf8Data);
    }
  });

  connection.on('close', () => {
    console.log('connection closed');
  });
});

module.exports.wsServer = wsServer;
module.exports.sendAllWS = sendAll;
