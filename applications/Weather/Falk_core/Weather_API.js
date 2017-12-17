/**
 * Created by vivek nayak on 26-12-2016.
 */
//GET Weather Data. Returns JSON
var V = require('./Vars.js');
var parseString = require('xml2js').parseString;
module.exports.getWeatherData = function (start, end, done) {
    var get_options = {
        url: 'https://api.worldweatheronline.com/premium/v1/past-weather.ashx?q='
        + V.coord + '&key=' + V.myKey + '&date=' + start + '&enddate=' + end
    };

    function get_callback(error, response, body) {
        if (!error) {
            parseString(body, function (err, result) {
                if (!err) {
                    console.log("Finished");
                    done(null, result.data.weather);
                }
                else
                    done(err, null);
            });
        }
        else
            done(error, null);
    }
    //var waitTill = new Date(new Date().getTime() + (i%2)  * 1000);
    //while (waitTill > new Date()) {}
    V.request.get(get_options, get_callback);
};

