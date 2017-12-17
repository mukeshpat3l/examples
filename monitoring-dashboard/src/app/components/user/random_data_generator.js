/*
  For Running Script : 
  node RandomInputDataToFalkonry.js <merlin-url> <apiToken> <datastreamId> <true/false>

  // For non Streaming
  node RandomInputDataToFalkonry.js https://dev.falkonry.ai ffwaqz371ae52m4j2f7e3o408b2bf1cv 4njyai5rc5twb9

  // For Streaming
  node RandomInputDataToFalkonry.js https://dev.falkonry.ai ffwaqz371ae52m4j2f7e3o408b2bf1cv 4njyai5rc5twb9 true
*/
var request = require('request');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var merlinHost = process.argv[2];
var apiToken   = process.argv[3];
var datastream = process.argv[4];
var streaming  = process.argv[5] || false;
var hasMoreData = process.argv[6] || false;
var interval   = process.argv[7] || 5;
var debug_mode = "true";
var data       = [];
var client     = null;

process.on('SIGINT', function() {
  if(client)
    client.end();
  process.exit(0);
});

if(!merlinHost || !apiToken || !datastream) {
  console.log("Usage: \n\tnode Random.js {merlin-url} {apiToken} {datastream-id}");
  process.exit(1);
}

var get_value = function() {
  return Math.random()*100;
};

var get_data = function(time, unit) {
  return JSON.stringify({
    "time": time,
    "unit": unit,
    "signal1" : get_value(),
    "signal2" : get_value()
    /*"signal3" : get_value(),
    "signal4" : get_value(),
    "signal5" : get_value(),
    "signal6" : get_value(),
    "signal7" : get_value()*/
  });
};

var send_data = function(){
  var data = [];
  var time = Date.now();
  data.push(get_data(time, "UNIT-1"));
  data.push(get_data(time, "UNIT-2"));
  data.push(get_data(time, "UNIT-3"));
  if(debug_mode === "true")
    console.log(JSON.stringify(data));
  request.post({
    headers: {'Content-Type' : 'text/plain', 'Authorization': 'Bearer '+apiToken},
    url:     merlinHost+'/datastream/'+datastream+"?streaming="+streaming+"&hasMoreData="+hasMoreData,
    body:    data.join("\n")
  }, function(error, response, body){
    if(error) {
      console.log(error);
      process.exit(1);
    }
    if(debug_mode === "true")
      console.log(body);
    setTimeout(send_data, interval*1000);
  });
};

send_data();