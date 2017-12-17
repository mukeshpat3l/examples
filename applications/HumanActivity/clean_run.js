/**
 * Created by vivek nayak on 29-12-2016.
 */
var EB_name = "", PL_name = "", API_key = "";
var async = require("async");
var M = require("./Falk_core/Maker");
var V = require("./Falk_core/Name_Vars");
var Deploy = {EB: null, PL: null, MR: null};
var index = 1;
var D_code;
var filename = "";
var entity_name = "";
var retrieval_pause = 1; //Number of minutes

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

module.exports.deployNew = function (PL_n, A_key, code, done) {
    var callback_sent = false;
    console.log("Entered deployNew()");
    EB_name = PL_n;
    PL_name = PL_n;
    API_key = A_key;
    D_code = code;

    async.waterfall([
        F_setAPIKey,
        F_makeEB,
        F_sendData,
        function (callback) {
            //Make pipeline
            M.makePL(PL_name, V.A_name, Deploy.EB, function (err, res) {
                if (!err) {
                    Deploy.PL = res;
                    console.log("PL of id " + Deploy.PL.id + " created");
                    if(!callback_sent) {
                        callback_sent = true;
                        done(null, Deploy.PL);
                    }
                    callback(null);
                }
                else
                    callback("PL Creation failed: " + err, null);
            });
        },
        //F_sendFacts,
        F_revise,
        F_live
    ], function (err, result) {
        if (err) {
            console.log("Error : "+err);
            if(!callback_sent)
                done(err, null);
        }
        else {
            if (D_code == 0) {
                console.log("Beginning Weather Retrieval");
                y = 2015;
                m = 1;
                sendWeatherData(y, m);
            }
            else{
                console.log("Uploading live data...");
                M.dataStream(Deploy.EB);
            }
        }
    });
};

var sendWeatherData = function (y, m) {
    setTimeout(function () {
        Weather_retriever_and_upload(y, m, function (error, result) {
            m++;
            if (m == 13) {
                return;
            }
            else {
                sendWeatherData(y, m);
            }
        });
    }, retrieval_pause * 60 * 1000);
};

var Weather_retriever_and_upload = function (y, m, cb) {
    var W = require('./Falk_core/Weather_API');
    async = require("async");
    _ = require('underscore');
    var asyncTasks = [];
    fs = require('fs');
    var csvWriter = require('csv-write-stream');
    var v_write = csvWriter({headers: ["time", "city", "T", "P", "W_speed", "W_chill", "Humidity", "Visibility", "Ppt"]});
    v_write.pipe(fs.createWriteStream('temp_storage.csv'));
    asyncTasks.push(function (asyncCB) {
        first = new Date(y, m, 1);
        last = new Date(y, m + 1, 0);
        W.getWeatherData(formatDate(first), formatDate(last), asyncCB);
    });

    async.series(asyncTasks, function (err, res) {
        console.log(y+" and "+m);
        if (!err) {
            _.each(res, function (weather) {
                _.each(weather, function (day) {
                    _.each(day.hourly, function (hour) {
                        desc = hour.weatherDesc[0];
                        stamp = hour.time[0];

                        if (stamp <= 900) {
                            Hrs = '0' + stamp / 100 + ':00:00';
                        }
                        else {
                            Hrs = stamp / 100 + ':00:00';
                        }

                        arr = [day.date[0] + "T" + Hrs, "San Francisco", hour.tempF[0], hour.pressure[0], hour.windspeedMiles[0], hour.humidity[0], hour.visibility[0], hour.precipMM[0]];
                        v_write.write(arr);
                    })
                })
            });
            v_write.end();
            M.sendDataToEB("temp_storage.csv", Deploy.EB.id, function (e, r) {
                if (!e) {
                    console.log("Waiting");
                    var waitTill = new Date(new Date().getTime() + 7 * 1000);
                    while (waitTill > new Date()) {
                    }
                }
                return cb(null, null);
            });
        }
        else {
            _.each(err, function (eachErr) {
                console.log("API returned error: " + eachErr);
            });
            return cb(true, null);
        }
    });
};

function F_setAPIKey(callback) {
    console.log("Setting key");
    M.setKey(API_key, function (e, r) {
        if (r == "Done") {
            callback(null);
        }
        else
            callback("API key failed", null);
    });
}

function F_makeEB(callback) {
    if (D_code == 0) {
        entity_name = "city";
        time_type = "iso_8601";
    }
    else {
        entity_name = "person";
        time_type = "millis";
    }
    M.makeEB(time_type, EB_name, entity_name, "time", function (err, res) {
        if (!err) {
            Deploy.EB = res;
            console.log("Event Buffer of ID " + Deploy.EB.id + " created");
            callback(null);
        }
        else
            callback("EB creation failed: " + err, null);
    });
}

function F_sendData(callback) {
    if (D_code == 0) //Weather
        filename = V.WP_D_file;
    else
        filename = V.HA_D_file;

    M.sendDataToEB(filename, Deploy.EB.id, function (err, res) {
        if (!err) {
            console.log(res);
            var waitTill = new Date(new Date().getTime() + 7 * 1000);
            while (waitTill > new Date()) {
            }
            M.getEB(Deploy.EB.id, function (err, res) {
                if (!err) {
                    Deploy.EB = res;
                    console.log("Event Buffer of ID " + Deploy.EB.id + " retrieved");
                    callback(null);
                }
                else
                    callback("EB Retrieval Failed: " + err, null);
            });
        }
        else
            callback("Data Upload failed: " + err, null);
    });
}

function F_sendFacts(callback) {
    M.getPL(Deploy.PL.id, function (err, res) {
        if (!err) {
            Deploy.PL = res;
            if (D_code == 0)
                filename = V.WP_V_file;
            else
                filename = V.HA_V_file;
            M.sendFactsToPL(filename, Deploy.PL.id, function (err, res) {
                if (!err) {
                    console.log(res);
                    console.log("Waiting...");
                    var waitTill = new Date(new Date().getTime() + 12 * 1000);
                    while (waitTill > new Date()) {
                    }
                    callback(null);
                }
                else
                    callback("Fact Sending failed: " + err, null);
            });
        }
        else
            callback("PL Retrieval failed: " + err, null);
    });
}

function F_revise(callback) {
    M.revise(Deploy.PL.id, V.A_desc + index, function (err, res) {
        if (!err) {
            console.log("MR of ID " + res + " created.");
            M.getPL(Deploy.PL.id, function (err, res) {
                if (!err) {
                    Deploy.PL = res;
                    M.checkModelComplete(Deploy.PL, 1, function (e, r) {
                        if (!e) {
                            callback(null);
                        }
                        else {
                            callback("MR Waiting failed: " + err, null);
                        }
                    });
                }
                else
                    callback("PL Retrieval failed: " + err, null);
            });
        }
        else
            callback("MR initiation failed: " + err, null);
    });
}

function F_live(callback) {
    M.openPL(Deploy.PL.id, function (e, r) {
        if (!e) {
            callback(null, r);
        }
        else {
            callback("Real time failed: " + err, null);
        }
    });
}