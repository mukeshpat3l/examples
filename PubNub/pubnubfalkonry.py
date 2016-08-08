import os, sys
from falkonryclient import client as Falkonry
from falkonryclient import schemas as Schemas
import time
import yaml
import base64
from bunch import bunchify

data = bunchify(yaml.safe_load(open('data.yaml')))
falkonry     = Falkonry('https://service.falkonry.io', base64.b64decode(data.auth_token))

startTime    = None #str(time.time()-1000*60*60) #seconds since unix epoch
endTime      = None #str(time.time()) #seconds since unix epoch

outputStream = falkonry.get_output(data.pipeline_id,startTime,endTime)
for x in outputStream:
    print x
