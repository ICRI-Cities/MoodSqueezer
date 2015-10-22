/**
 * Created by sarahg on 22/10/15.
 */

var CronJob = require('cron').CronJob;

var Database = require('./Database');
var db = new Database();
var dbName = "floordb";

var queries = require('./Queries');

var counts = [];

db.GetFromDB(dbName, queries.dbQuery, function(values) {
    counts[0] = values[0].ball0;
    counts[1] = values[0].ball1;
    counts[2] = values[0].ball2;
    counts[3] = values[0].ball3;
    counts[4] = values[0].ball4;
    counts[5] = values[0].ball5;
    module.exports.counts = counts;
});

new CronJob('0 0 * * * *', function() {  //run at midnight every night
    module.exports.counts = [];
}, null, true, 'Europe/London');


var SqueezeCounts = function(){};

SqueezeCounts.prototype.UpdateCounts = function(index){
    counts[index]++;
    module.exports.counts = counts;
};

module.exports = SqueezeCounts;