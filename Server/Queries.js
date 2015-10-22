/**
 * Created by sarahg on 22/10/15.
 */

var timestamp = new Date();
var dataDate = '\"'+timestamp.getFullYear()+"-"+(timestamp.getMonth()+1)+"-"+timestamp.getDate()+'\"';

var dbQuery = 'select '+
    '(select count(colour) from squeezeData where colour = 0 and date = '+dataDate+') as ball0, '+
    '(select count(colour) from squeezeData where colour = 1 and date = '+dataDate+') as ball1, '+
    '(select count(colour) from squeezeData where colour = 2 and date = '+dataDate+') as ball2, '+
    '(select count(colour) from squeezeData where colour = 3 and date = '+dataDate+') as ball3, '+
    '(select count(colour) from squeezeData where colour = 4 and date = '+dataDate+') as ball4, '+
    '(select count(colour) from squeezeData where colour = 5 and date = '+dataDate+') as ball5';

module.exports.dbQuery = dbQuery;