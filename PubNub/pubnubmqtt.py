from pubnub import Pubnub
import paho.mqtt.client as mqtt
import yaml
import json
import time
import random
from bunch import bunchify

client = mqtt.Client()
data = bunchify(yaml.safe_load(open('data.yaml')))
client.connect(data.mqtt_broker,data.mqtt_port,60)

def receive(msg,two):

    msg = json.dumps(msg)
    msg = json.loads(msg)
    msg['sensor_uuid']=str(random.randint(1,5))
    msg = json.dumps(msg)

    client.publish(data.mqtt_topic, bytes(msg))
    print(msg)
    return True

pubnub = Pubnub(
    data.pubnub_publish_key,
    data.pubnub_subscribe_key
    ).subscribe(
        channels = data.pubnub_channel,
        callback = receive
        )
