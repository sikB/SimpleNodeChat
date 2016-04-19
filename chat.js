var http = require('http');
var fs = require('fs');
var port = process.env.PORT || '8000';
var server = http.createServer(function(req,res){
	fs.readFile('index.html', 'utf-8', function(error, data){
		res.writeHead(200, {'content-type': 'text/html'});
		res.write('<script>var port=' +port+'</script>');
		res.write(data);
		res.end();
	});
});

var io = require('socket.io').listen(server);
messageArray = [];
numUsers = 0;

io.sockets.on('connect', function(socket){
	numUsers++;
	io.sockets.emit('message_to_client',{
		numUsers: numUsers
	});

	socket.on('message_to_server', function(data){
		var date = new Date();
		io.sockets.emit('message_to_client', {
			message: data.message,
			 date: date
			});
		messageArray.push(data.message);
	});
});

server.listen(port);
console.log('Local host is running');