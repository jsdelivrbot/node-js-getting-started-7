
/*
//upgrade required error
//Failed to load resource: the server responded with a status of 426 (Upgrade Required)
var server = require('ws').Server;

//var s = new server({port:8080});

var my_port = process.env.PORT || 5000;
var s = new server({port:my_port});
//var s = new WebSocket('ws://cryptic-ocean-42125.herokuapp.com');
console.log("server running!")


//"url": "https://github.com/heroku/node-js-getting-started"
// "https://github.com/inspectaTech/node-js-getting-started.git"

s.on('connection',function(ws){
	//var id = w.upgradeReq.headers['sec-websocket-key'];

	ws.on('message',function(message){
		console.log("Received: " + message);//console logs appear on the command line

		message = JSON.parse(message);
		if(message.type == "name")
		{
			ws.personName = message.data;
			return;
		}//end if

		s.clients.forEach(function e(client){
			if(client != ws){
				//you need the name of the one sending the message not the one recieving it
				client.send(JSON.stringify({
					name:ws.personName,
					data: message.data
				}));
			}//end if
		})

		//ws.send("From Server: " + message);
	});
	ws.on('close',function(){
		console.log("I lost a client");
	});
});
*/

/*
//websocket example
//#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

var my_port = process.env.PORT || 8080;
//var my_port = 8080;

server.listen(my_port, function() {
    console.log((new Date()) + ' Server is listening on port ');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
*/
//heroku's example
//'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'blank.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const s = new SocketServer({ server });//const wss

/*s.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});*/

setInterval(() => {
  s.clients.forEach((client) => {
    //client.send(new Date().toTimeString());
		client.send(JSON.stringify({
			name:"time",
			data: new Date().toLocaleString()
		}));
  });
}, 45000);

s.on('connection',function(ws){

	ws.on('message',function(message){
		console.log("Received: " + message);//console logs appear on the command line

		message = JSON.parse(message);
		if(message.type == "name")
		{
			ws.personName = message.data;
			s.clients.forEach((client) => {
				//client.send(new Date().toTimeString());
				client.send(JSON.stringify({
					name:"group msg",
					data: ws.personName + "has joined the discussion."
				}));
			});
			
			return;
		}//end if

		s.clients.forEach(function e(client){
			if(client != ws){
				//you need the name of the one sending the message not the one recieving it
				client.send(JSON.stringify({
					name:ws.personName,
					data: message.data
				}));
			}//end if
		})

		//ws.send("From Server: " + message);
	});
	ws.on('close',function(){
		console.log("I lost a client");
		s.clients.forEach(function e(client){
			if(client == ws){
				client.send(JSON.stringify({
					name:ws.personName,
					data: "I'm lost!"
				}));
			}//end if client
		});
	});//end on('close'
});
