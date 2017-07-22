
var server = require('ws').Server;

//var s = new server({port:8080});

var my_port = process.env.PORT || 5000;
var s = new server({port:my_port});
//var s = new WebSocket('ws://cryptic-ocean-42125.herokuapp.com');
console.log("server running!")


//"url": "https://github.com/heroku/node-js-getting-started"
// "https://github.com/inspectaTech/node-js-getting-started.git"

s.on('connection',function(ws){
	var id = w.upgradeReq.headers['sec-websocket-key'];
	
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
