# Falkonry-Pubnub Integration
--------------------------------------------------------------------------------

## Setup instructions:

* Create a new EventBuffer by uploading sampleData.json and ticking the sample data checkmark.
* Add an external subscription via MQTT and choose an MQTT topic in data.yaml.
    * Broker url: mqtt://broker.hivemq.com:1883
    * Mqtt topic: <same as data.yaml>
* In the terminal run the following commands to install dependencies of this
   demo:
    * pip install paho-mqtt
    * pip install bunch
    * pip install PyYaml
    * pip install falkonryclient
    * pip install pubnub
* In the data.yaml file input your Pipeline Id and Falkonry Authorization Token. A sample data source (Pubnub Field Sensor Network https://www.pubnub.com/developers/realtime-data-streams/sensor-network/) is pre-linked.
* Run pubnubmqtt.py
    * python pubnubmqtt.py
* Create a pipeline using the created EventBuffer
* After a few minutes run a new revision.
* After this completes run pubnubfalkonry.py to retrieve category classifications
created by your revision from Falkonry
    * python pubnubfalkonry.py
