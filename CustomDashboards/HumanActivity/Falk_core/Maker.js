/**
 * Created by vivek nayak on 22-12-2016.
 */
var V = require('./Vars.js');
_ = require('underscore');
var MR = null;
var API_key = "";
var fs = require("fs");
var csv = require('fast-csv');
var papa = require('papaparse');

module.exports.setKey = function (key, done) {
    API_key = key;
    done(null, "Done");
};

//GET list of Pipelines
module.exports.getPL_list = function (done) {
    console.log("Retrieving Pipelines");
    var get_options = {
        url: V.url + 'pipeline',
        headers: {
            'Authorization': 'Bearer ' + API_key,
            'Content-Type': 'application/json'
        }
    };

    function get_callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            return done(null, info);
        }
        else if (response.statusCode == 401)
            return done("Unauthorized/API Key Invalid", null);
        else {
            return done(error, null);
        }
    }

    V.request.get(get_options, get_callback);
};

//GET Pipeline Output
module.exports.getPLoutput = function (pl_id, done) {
    console.log("Continuous Output");
    var get_options = {
        url: V.url + 'pipeline/' + pl_id + '/output',
        headers: {
            'Authorization': 'Bearer ' + API_key,
            'Content-Type': 'application/json'
        }
    };

    function get_callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            return done(null, body);
        }
        else if (response.statusCode == 400)
            return done(response.message, null);
        else {
            return done(error, null);
        }
    }

    V.request.get(get_options, get_callback);
};

//POST an Event Buffer. Returns an EB object when successful
module.exports.makeEB = function (time_type, name, entityID, timeID, done) {
    console.log("Beginning EventBuffer creation...");
    var jsonOb = {
        "name": name,
        "entityIdentifier": entityID,
        "timeIdentifier": timeID,
        "timeFormat": time_type,
        "timezone": {
            "zone": "GMT",
            "offset": 0
        }
    };
    var s = JSON.stringify(jsonOb);

    var post_options = {
        url: V.url + 'eventBuffer',
        headers: {
            'Authorization': 'Bearer ' + API_key,
            'Content-Type': 'application/json'
        },
        body: s
    };

    function post_callback(err, response, body) {
        if (!err && response.statusCode == 201) {
            var info = JSON.parse(body);
            return done(null, info);
        }
        else if (!err && response.statusCode == 400) {
            return done("Bad Data", null);
        }
        else if (!err && response.statusCode == 409) {
            return done("Given EB already exists", null);
        }
        else {
            return done(err, null);
        }
    }

    V.request.post(post_options, post_callback);
};

//POST Data to given Event Buffer. Returns a Message when successful
module.exports.sendDataToEB = function (filename, id, done) {
    readCSVFile(filename, function (err, res) {

        if (!err) {
            console.log("Loading Data onto EB...");
            var post_options = {
                url: V.url + 'eventBuffer/' + id,
                headers: {
                    'Authorization': 'Bearer ' + API_key,
                    'Content-Type': 'text/plain'
                },
                body: res
            };

            function post_callback(error, response, body) {
                if (!error && response.statusCode == 202) {
                    return done(null, "Data uploaded");
                }
                else if (!error && response.statusCode == 404) {
                    return done("Event Buffer given does not exist", null);
                }
                else
                    return done(error, null);
            }

            V.request.post(post_options, post_callback);
        }
        else {
            console.log(err);
        }
    });
};

//POST a Pipeline. Returns Pipeline info when successful
module.exports.makePL = function (name, a_name, EB, done) {
    console.log("Starting Pipeline creation...");
    var list = EB.schemaList[0].signalList;
    var name_list = [];
    for (i = 0; i < list.length; i++) {
        name_list[i] = list[i].name;
    }

    var jsonOb = {
        "name": name,
        "input": EB.id,
        "inputList": list,
        "assessmentList": [
            {
                "name": a_name,
                "inputList": name_list
            }
        ]
    };

    var s = JSON.stringify(jsonOb);

    var post_options = {
        url: V.url + 'pipeline',
        headers: {
            'Authorization': 'Bearer ' + API_key,
            'Content-Type': 'application/json'
        },
        body: s
    };

    function post_callback(error, response, body) {
        if (!error && response.statusCode == 201) {
            var info = JSON.parse(body);
            return done(null, info);
        }
        else if (!error && response.statusCode == 400) {
            return done("Bad Data Received", null);
        }
        else if (!error && response.statusCode == 409) {
            return done("Pipeline already exists", null);
        }
        else {
            return done(error, null);
        }
    }

    V.request.post(post_options, post_callback);
};

//POST a Revision Model. Returns message when successful
module.exports.revise = function (p_id, desc, done) {
    console.log("Starting model revision for  Pipeline ID " + p_id + " now...");

    /*var jsonOb = {
     "description": desc,
     "clustering": {
     "lowerBound": 4,
     "upperBound": 10
     },
     "interval": {
     "duration": "PT1S",
     "windowUpperBound": "P30D"
     },
     "entityList": entityList,
     "segmentList": [
     {
     "dataSource": dat_source,
     "startTime": start_time,
     "endTime": end_time
     }
     ]
     };*/
    var jsonOb = {
        "description": desc
    };
    var s = JSON.stringify(jsonOb);

    var post_options = {
        url: V.url + 'pipeline/' + p_id + '/reviseModel',
        headers: {
            'Authorization': 'Bearer ' + API_key,
            'Content-Type': 'application/json'
        },
        body: s
    };

    function post_callback(error, response, body) {
        if (!error && response.statusCode == 201) {
            var info = JSON.parse(body);
            return done(null, info.model);
        }
        else if (!error && response.statusCode == 404) {
            return done("Pipeline not found", null);
        }
        else if ((!error && response.statusCode == 409)) {
            return done("Previous model revision still running", null);
        }
        else {
            return done(error, null);
        }
    }

    V.request.post(post_options, post_callback);
};

//POST Facts to Pipeline. Returns info when successful
module.exports.sendFactsToPL = function (filename, p_id, done) {
    readCSVFile(filename, function (err, res) {
        if (!err) {
            console.log("Uploading Facts to Pipeline...");
            var post_options = {
                url: V.url + 'pipeline/' + p_id + '/facts',
                headers: {
                    'Authorization': 'Bearer ' + API_key,
                    'Content-Type': 'text/plain'
                },
                body: res
            };

            function post_callback(error, response, body) {
                if (!error) {
                    var info = JSON.parse(body);
                    return done(null, info.message);
                }
                else if (!error && response.statusCode == 404) {
                    return done("Pipeline not found", null);
                }
                else {
                    return done(error, null);
                }
            }

            V.request.post(post_options, post_callback);
        }
        else {
            return done(err, null);
        }
    });
};

//POST: Open a Pipeline. Returns message when successful
module.exports.openPL = function (p_id, done) {
    _this=this;
    this.getPL(p_id, function (e, pipeline) {
        if (!e) {
            _this.getEB(pipeline.input, function (e, r) {
                if(!e) {
                    console.log("Opening  Pipeline ID " + p_id + " now...");
                    var startTime = new Date(r.earliestDataPoint).toISOString();
                    var post_options = {
                        url: V.url + 'pipeline/' + p_id + '/open?startTime=' + startTime,
                        headers: {
                            'Authorization': 'Bearer ' + API_key,
                            'Content-Type': 'application/json'
                        }
                    };


                    function post_callback(error, response, body) {
                        if (!error && response.statusCode == 201) {

                            return done(null, "Pipeline opened");
                        }
                        else if (!error && response.statusCode == 400) {
                            return done("Model Revision going on", null);
                        }
                        else if (!error && response.statusCode == 404) {
                            return done("Pipeline id " + id + " not found. ", null);
                        }
                        else {
                            return done(error, null);
                        }
                    }


                    V.request.post(post_options, post_callback);

                }
            });

        }
    });

};

//POST: Close a Pipeline. Returns message when successful
module.exports.closePL = function (p_id, done) {
    console.log("Closing Pipeline of ID " + p_id + "...");

    var post_options = {
        url: V.url + 'pipeline/' + p_id + '/close',
        headers: {
            'Authorization': 'Bearer ' + API_key,
            'Content-Type': 'application/json'
        },
        id: p_id
    };

    function post_callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            return done(null, "Pipeline closed");
        }
        else if (!error && response.statusCode == 400) {
            return done("Pipeline not found", null);
        }
        else {
            return done(error, null);
        }
    }

    V.request.post(post_options, post_callback);
};

//GET an EventBuffer. Returns EB object when successful
module.exports.getEB = function (id, done) {
    console.log("Retrieving event buffer info...");
    var get_options = {
        url: V.url + 'eventBuffer',
        headers: {
            'Authorization': 'Bearer ' + API_key,
            'Content-Type': 'application/json'
        }
    };

    function get_callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            _.each(info, function (EB) {
                if (EB.id == id) {
                    return done(null, EB);
                }
            });
        }
        else
            return done(error, null);
    }

    V.request.get(get_options, get_callback);
};

//GET a Pipeline. Returns PL object when successful
module.exports.getPL = function (id, done) {
    console.log("Retrieving pipeline info...");
    var get_options = {
        url: V.url + 'pipeline',
        headers: {
            'Authorization': 'Bearer ' + API_key,
            'Content-Type': 'application/json'
        }
    };

    function get_callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            _.each(info, function (PL) {
                if (PL.id == id) {
                    return done(null, PL);
                }
            });
        }
        else {
            return done(error, null);
        }
    }

    V.request.get(get_options, get_callback);
};

//GET Model Revision Output. Returns MR object when successful
module.exports.getRevisionOutput = function (p_id, MR_index, done) {
    console.log("Retrieving MR info for index " + MR_index + " of pipeline " + p_id + "...");
    var get_options = {
        url: V.url + 'pipeline/' + p_id + '/modelRevision/' + MR_index + '/output',
        headers: {
            'Authorization': 'Bearer ' + API_key,
            'Accept': 'application/json'
        },
        id: p_id,
        modelRevisionIndex: MR_index
    };

    function get_callback(error, response, body) {
        console.log("Response is " + response.statusCode);
        if (response.statusCode == 200) {
            return done(null, body);
        }
        else if (response.statusCode == 400) {
            console.log("Entered here");
            return done(JSON.parse(body).message, null);
        }
        else {
            return done(error, null);
        }
    }

    V.request.get(get_options, get_callback);
};

//GET latest condition results (Pipeline). Returns results when successful
module.exports.getResults = function (p_id, done) {
    console.log("Retrieving results for pipeline " + p_id + " ...");
    var get_options = {
        url: V.url + 'pipeline/' + p_id + '/output',
        headers: {
            'Authorization': 'Bearer ' + API_key,
            'Content-Type': 'application/json'
        },
        id: p_id
    };

    function get_callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            return done(null, info);
        }
        else {
            return done(error, null);
        }
    }

    V.request.get(get_options, get_callback);
};

//DELETE an EventBuffer. Returns message when successful
module.exports.removeEB = function (id, done) {
    console.log("Deleting eventbuffer of id " + id);
    var del_options = {
        url: V.url + 'eventBuffer/' + id,
        headers: {'Authorization': 'Bearer ' + API_key},
        id: id
    };

    function del_callback(error, response, body) {
        if (!error && response.statusCode == 204) {
            return done(null, "Successfully deleted EB " + id);
        }
        else if (!error && response.statusCode == 404) {
            return done("Event Buffer does not exist! Can't delete!", null);
        }
        else if (!error && response.statusCode == 409) {
            return done("Event Buffer is in use! Can't delete!", null);
        }
        else {
            console.log("Error returned: " + error);
            return done(error, null);
        }
    }

    V.request.delete(del_options, del_callback);
};

//DELETE a PipeLine. Returns message when successful
module.exports.removePL = function (id, done) {
    console.log("Deleting pipeline of id " + id);
    var del_options = {
        url: V.url + 'pipeline/' + id,
        headers: {'Authorization': 'Bearer ' + API_key},
        id: id
    };

    function del_callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            return done(null, "Successfully deleted Pipeline " + id);
        }
        else if (!error && response.statusCode == 404) {
            return done("Event Buffer does not exist! Can't delete!", null);
        }
        else {
            return done(error, null);
        }
    }

    V.request.delete(del_options, del_callback);
};

//Check if Model has been made
var ctr = 1;
module.exports.checkModelComplete = function (res, k, done) {
    var _this = this;
    var retry = true;
    arr = res.modelRevisionList;
    for (i = 0; i < arr.length; i++) {
        if (arr[i].index == k) {
            MR = arr[i];
            break;
        }
    }
    console.log("Ping: " + ctr + ", Model Revision INDEX " + MR.index + ", Status: " + MR.status);
    if (MR.status == "COMPLETED") {
        retry = false;
    }
    else if (MR.status == "FAILED") {
        done("Model Revision: Internal Server Error", null);
    }
    if (retry) {
        ctr++;
        console.log("Trying again...");
        setTimeout(function (res, k, done) {
            _this.getPL(res.id, function (err, res) {
                if (!err)
                    _this.checkModelComplete(res, k, done);
                else {
                    return done(err, null);
                }
            });
        }, 10000, res, k, done);
    }
    else {
        ctr = 1;
        retry = true;
        return done(null, res);
    }
};

//POST live data
module.exports.dataStream = function(EB){
    module.exports.sendDataToEB('file2.csv',EB.id,function(error,response){
        if(!error){
            readCSVFile("file2.csv",function(err,res) {
                var results = papa.parse(res, {
                    header: true
                });
                var c = 1467836664585;
                var counter = 0;
                module.exports.postLive(results, EB, counter, c);
            });

        }
    });
};

//POST data {Recursive function}
module.exports.postLive = function(fileObj,EBObject,counter,baseTime){
    var str = "";
    var k = 40;
    for(var i = 0; i<7499; i++){
        fileObj.data[i].time = JSON.stringify(baseTime+k);
        baseTime = baseTime + k;
        str += JSON.stringify(fileObj.data[i])+'\n';
    }

    setTimeout(function () {
        module.exports.sendDataToEBLIVE(str, EBObject.id,function(err){
            if(!err){
                if(counter <12) {
                    console.log("Posting data...");
                    counter++;

                    module.exports.postLive(EBobject,counter);
                }

                else
                    return done("Done!!");
            }
            else
                return done(err);

        })},299960);


};

//POST data to event buffer for live
module.exports.sendDataToEBLIVE = function (filename, id, done) {


    console.log("Loading Data onto EB...");
    var post_options = {
        url: V.url + 'eventBuffer/' + id,
        headers: {
            'Authorization': 'Bearer ' + API_key,
            'Content-Type': 'text/plain'
        },
        body: filename
    };

    function post_callback(error, response, body) {
        if (!error && response.statusCode == 202) {
            return done(null, "Data uploaded");
        }
        else if (!error && response.statusCode == 404) {
            return done("Event Buffer given does not exist", null);
        }
        else
            return done(error, null);
    }

    V.request.post(post_options, post_callback);
};


//Read a CSV file
function readCSVFile(filename, done) {
    var str = "";
    console.log("Reading file given - " + filename);
    fs.createReadStream(filename).pipe(csv())
        .on('data', function (chunk) {
            str += chunk.toString() + "\n";
        })
        .on('end', function () {
            console.log("Finished reading csv file");
            return done(null, str)
        })
        .on('error', function (err) {
            return done(err, null);
        });
}