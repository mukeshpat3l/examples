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
var counter  = 0;


module.exports.deployNew = function (PL_n, A_key, code, done) {
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
                    done(null, Deploy.PL);
                    callback(null);
                }
                else
                    callback("PL Creation failed: " + err, null);
            });
        },
        F_sendFacts,
        F_revise,
        F_live
    ], function (err, result) {
        if (err)
            done(err, null);
        else {
            if (D_code == 0) {

            }
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
            console.log(res);
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
            var waitTill = new Date(new Date().getTime() + 10 * 1000);
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
        if (!err){
            console.log("MR of ID " + res + " created.");
            callback();
        }
        else
            callback("MR initiation failed: " + err, null);
    });
}

function F_live(callback) {
    M.openPL(Deploy.PL.id, function (err, res) {
        if (!err) {
            callback(null, res);
        }
        else {
            callback("Real time failed: " + err, null);
        }
    });
}