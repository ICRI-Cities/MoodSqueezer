/**
 * Created by sarahg on 22/10/15.
 */

var Database = require('./Database');
var db = new Database();
var dbName = "floordb";

var SqueezeCounts = require('./SqueezeCounts');
var sc = new SqueezeCounts();

function handlePing(){
    var timestamp = new Date();
    var date = timestamp.getFullYear()+"-"+(timestamp.getMonth()+1)+"-"+timestamp.getDate();
    var time = timestamp.toTimeString();
    console.log(date+" | "+time+" : Squeezebox still connected");
}

function handleNewData(io, data){
    //parse squeeze data
    var dataString = data.toString();
    var charArray = dataString.split('');

    if(charArray[0] == "S") {
        //store to DB
        console.log("Got message from squeeze box: " + data.toString());
        console.log("storing squeeze instance to database");

        //get date and time for primary keys
        var timestamp = new Date();
        var date = timestamp.getFullYear() + "-" + (timestamp.getMonth() + 1) + "-" + timestamp.getDate();
        var time = timestamp.toTimeString();

        //convert to char array
        var squeezeData = [];
        for (var i = 1; i < 6; i++) {
            squeezeData[i - 1] = charArray[i];
        }

        var floor = squeezeData[0];
        var ball = squeezeData[1];
        var intensity = squeezeData[2];
        var duration = squeezeData[3];

        //upload to database
        var query = 'insert into squeezeData set ?';
        var storeset = {date: date, time: time, floor: floor, ball: ball, intensity: intensity, duration: duration};
        db.StoreToDB(dbName, query, storeset);

        //update counts and clients
        sc.UpdateCounts(ball);

        //broadcast update to clients
        io.sockets.emit('results', SqueezeCounts.counts);
    }
}

/**
 * @constructor
 */
var SqueezyBalls = function(){};

SqueezyBalls.prototype.HandleInput = function(io, data){

    if (data == "p"){
        handlePing();
    }else{
        handleNewData(io, data);
    }
};

module.exports = SqueezyBalls;