/**
 * Created by sarahg on 22/10/15.
 */

var SqueezeCounts = require('./SqueezeCounts');

var SqueezyBallsViz = function(){};

SqueezyBallsViz.prototype.HandleClient = function(socket){
    socket.emit('results', SqueezeCounts.counts);
};

module.exports = SqueezyBallsViz;