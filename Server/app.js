/**
 * Created by sarahg on 22/10/15.
 */

var httpPort = 9876;  //change to 8765
var netPort = 7654;

var express= require('express');
var path = require('path');
var app = express();

var httpApp = require('http').Server(app);
var io = require('socket.io')(httpApp);

var netApp = require('net').Server();

var SqueezyBalls = require('./SqueezyBalls');
var sb = new SqueezyBalls();

var SqueezyBallsViz = require('./SqueezyBallsViz');
var sbv = new SqueezyBallsViz();

app.use(express.static(path.join(__dirname, './public')));


//Handle client connections
io.on('connection', function(socket){
    sbv.HandleClient(socket);
});

/**
 * Webserver listener
 */
httpApp.listen(process.env.PORT || httpPort, function(){
    console.log("SqueezyBalls http server listening on port: "+httpPort);
});



//Handle squeeze box connections
netApp.on('connection', function(socket){
    console.log("Squeezebox is connected...");

    socket.on('data', function (data) {
        console.log("GOT DATA");
        console.log("Got squeeze: " + data.toString());
        sb.HandleInput(io, data);
    });

    socket.on('close', function(){
        console.log("Squeezebox connection closed");
    });

    socket.on('error', function(){
        console.log("error handled");
    });
});

/**
 * Net listener
 */
netApp.listen(netPort, function(){
    console.log("SqueezyBalls net server listening on port: "+netPort);
});