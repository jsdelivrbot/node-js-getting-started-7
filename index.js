
var server = require('ws').Server;
//var s = new server({port:5001});
var s = new WebSocket('ws://ancient-wave-29865.herokuapp.com/');

//"url": "https://github.com/heroku/node-js-getting-started"
// "https://github.com/inspectaTech/node-js-getting-started.git"

s.on('connection',function(ws){
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
