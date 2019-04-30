var express = require("express");
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);


var users = [];
var messages = [];
app.use('/Media/Sounds', express.static(__dirname + '/Media/Sounds'));
app.get("/", function(request, response) {
    console.log("opening /");
    response.sendFile(path.join(__dirname + '/index.html'));
});
app.get("/u", function(request, response) {
    console.log("opening /u");
    response.end(users);

});
io.on('connection', function(socket){
    console.log('connection');
    io.emit('user', users);
    socket.on('login', function(username, callback){
        console.log('login name: ' + username);
        if (users.includes(username)){
            console.log("login fail");
            callback(false);
        }else {
            console.log("login success");
            users.push(username);
            io.emit('user', users);
            io.emit('fill chat', messages);
            var user = username;
            callback(true);

            socket.on('disconnect', function(socket){
                console.log('disconnection');
                console.log(user)
                console.log('disconnection name: ' + user);
                var index = users.indexOf(user);
                if (index > -1) {
                    users.splice(index, 1);
                }
                io.emit('user', users);
            });
        };
    });

});
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
        messages.push(msg);

    });
    socket.on('writing', function(user){
        console.log('writing: ' + user);
        io.emit('writing', user);
    });
});


app.get("/c", function(request, response) {

    console.log("/c");
    response.sendFile(path.join(__dirname + '/chat.html'));

});
http.listen(3000, function(){
    console.log('listening on *:3000');
});