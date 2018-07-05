from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from falkonryclient import client as Falkonry
from falkonryclient import schemas as Schemas
from multiprocessing import Process
import pandas as pd
import random, io, requests, time, json, sys, os

#instantiate Falkonry
falkonry = None
datastream = None
host = None
token = None
datastreamId = None
assessmentId = None
fileName = None
statusResponse = {
    "datastream" : False,
    "addData" : False,
    "addFacts" : False,
    "modelCreated" : False,
    "liveMonitoring" : False,
    "assessmentId": None
}

def checkDataIngestion(tracker):
        tracker_obj = None
        for i in range(0, 12):
            tracker_obj = falkonry.get_status(tracker['__$id'])
            print(tracker_obj['status'])
            try:
                if tracker_obj['status'] == 'FAILED' or tracker_obj['status'] == 'ERROR':
                    raise Exception()
                if tracker_obj['status'] == 'COMPLETED' or tracker_obj['status'] == 'SUCCESS':
                    print("Data added successfully.")
                    break
            except:
                print("Cannot add data to datastream.")
            time.sleep(5)

        if tracker_obj['status'] == 'FAILED' or tracker_obj['status'] == 'PENDING':
            print("Cannot add data to datastream. Please try again.")


#create Datastream
def createDatastream(timeFormat, entityIdentifier):
    global statusResponse, datastream
    datastream = Schemas.Datastream()
    datasource = Schemas.Datasource()
    field = Schemas.Field()
    time = Schemas.Time()
    signal = Schemas.Signal()

    randomName = random.random()
    datastream.set_name('Example App' + str(randomName))  
    time.set_zone("GMT")                                       
    time.set_identifier("time")                                 
    time.set_format(timeFormat)                      
    field.set_time(time)
    field.set_entityIdentifier(entityIdentifier)
    field.set_signal(signal)    
    # signal.set_valueIdentifier("value")                         # set value identifier
    # signal.set_signalIdentifier("signal")                       # set signal identifier
    datasource.set_type("STANDALONE")                          
    datastream.set_datasource(datasource)
    datastream.set_field(field)
    
    print("Creating Datastream...")
    createdDatastream = falkonry.create_datastream(datastream)
    datastreamId = createdDatastream.get_id()

    statusResponse["datastream"] = True
    return datastreamId

# add data to datastream
def addDataToDatastream(datastreamId, filePath):
    global statusResponse, falkonry
    stream = io.open(filePath)

    options = {'streaming': False,
               'hasMoreData': False}

    print("Adding data...")
    if filePath.endswith('.csv'):
        inputResponse = falkonry.add_input_stream(datastreamId, 'csv', options, stream)
    elif filePath.endswith('.json'):
        inputResponse = falkonry.add_input_stream(datastreamId, 'json', options, stream)
    checkDataIngestion(inputResponse)
    statusResponse["addData"] = True
    
# get the created assessment
def getAssessment(datastreamId):
    global falkonry
    assessmentResponse = falkonry.get_assessments()
    assessmentId = None

    for assessment in assessmentResponse:
        if assessment.get_datastream() == datastreamId:
            assessmentId = assessment.get_id()

    return assessmentId

#add facts to the assessment
def addFactsToAssessment(assessmentId, timeFormat, timeZone, entityIdentifier, valueIdentifier, filePath):    
    global statusResponse, datastream
    stream = io.open(filePath)
    options = {
      'startTimeIdentifier': "time",
      'endTimeIdentifier': "end",
      'timeFormat': timeFormat,
      'timeZone':timeZone,
      'entityIdentifier': entityIdentifier,
      'valueIdentifier': valueIdentifier
    }

    print("Adding facts...")
    if filePath.endswith('.csv'):
        response = falkonry.add_facts_stream(assessmentId, 'csv', options, stream)
    elif filePath.endswith('.json'):
        response = falkonry.add_facts_stream(assessmentId, 'json', options, stream)
    #print(response)
    
    statusResponse["addFacts"] = True


# create a model
def createModel(assessmentId, startTime, endTime, entityList):
    global statusResponse    
    url = host + '/assessment/' + assessmentId + '/model'
    body = {
      "factConfig": None,
      "segmentList": [
        {
          "startTime": startTime,
          "endTime": endTime
        }
      ],
      "clustering": {
        "lowerBound": 4,
        "upperBound": 10
      },
      "entityList": entityList,  
      "interval": {
        "duration": "PT1S",
        "windowUpperBound": "P1D",
        "assessmentRate": "PT0S"
      },
      "unknownThreshold": 0.5
    }

    print("Creating Model...")
    response = requests.post(url, data = json.dumps(body), headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
        })

    #print(response.text)

def getModelIdAndPId(assessmentId):
    url = host + '/object/Model?assessment=' + assessmentId
    response = requests.get(url, headers = {
        'Authorization': 'Bearer ' + token
        })

    parsedResponse = json.loads(response.text)
    modelId = parsedResponse[0]['id']
    pId = parsedResponse[0]['pid']

    #print(pId)
    return [modelId, pId]

# check the status of model if it is running or completed
def checkStateOfModel(modelId, pId):
    url = host + '/processSpec/' + pId + '/status?modelId=' + modelId
    response = requests.get(url,  headers = {
        'Authorization': 'Bearer ' + token
        })

    parsedResponse = json.loads(response.text)
    state = parsedResponse['state']

    return state


# Apply the trained model
# def applyModel(assessmentId, modelId):
#     url = host + '/object/OutputSummary?assessment=' + assessmentId

#     response = requests.get(url, headers = {
#         'Authorization': 'Bearer ' + token
#         })

#     parsedResponse = json.loads(response.text)
#     outputSummary = parsedResponse[0]['id']

#     print(outputSummary)

#     url = host + '/assessment/' + assessmentId + '/applyModels/'
#     body = {
#         "outputSummary": outputSummary,
#         "generateOutput": False,
#         "models": [
#             {
#                 "id": modelId,
#                 "entities": [
#                     "p1"
#                 ]
#             }
#         ]
#     }

#     response = requests.post(url, data = json.dumps(body), headers = {
#         'Authorization': 'Bearer ' + token
#         })

#     print(response.text)


def turnOnLiveMonitoring(datastreamId):
    global statusResponse    
    response = falkonry.on_datastream(datastreamId)
    statusResponse["liveMonitoring"] = True


def postRealtimeData(data, fileType):
    global falkonry, datastreamId

    datastream = falkonry.get_datastream(datastreamId)

    options = {
        'streaming': True,
        'hasMoreData': False,
        'timeFormat': datastream.get_field().get_time().get_format(),
        'timeZone': datastream.get_field().get_time().get_zone(),
        'timeIdentifier': datastream.get_field().get_time().get_identifier(),
        'entityIdentifier': datastream.get_field().get_entityIdentifier()
    }

    inputResponse = falkonry.add_input_stream(datastreamId, fileType, options, data)

def getLiveOutput():
    global falkonry, assessmentId
    stream = falkonry.get_output(assessmentId, None)
    for event in stream.events():
        print(json.dumps(json.loads(event.data)))


def pushAndPullLiveData():
    global fileName
    data = io.open(fileName)

    if fileName.endswith('.csv'):
        fileType = 'csv'
    elif fileName.endswith('.json'):
        fileType = 'json'

    p1 = Process(target=getLiveOutput, args=())
    p1.start()
    p2 = Process(target=postRealtimeData, args=(data, fileType))
    p2.start()
    
    p1.join()
    p2.join()

def start(example):
    global statusResponse, datastreamId, assessmentId, fileName
    if example == 1:
        datastreamId = createDatastream("millis", "entity")
        addDataToDatastream(datastreamId, "ScriptAutomation/Source0.csv")
        assessmentId = getAssessment(datastreamId)
        addFactsToAssessment(assessmentId, "millis", "GMT", "entity", "value", "ScriptAutomation/HealthFacts.csv")
        time.sleep(5)
        createModel(assessmentId, "2017-02-16T10:30:00.000Z", "2017-02-24T10:27:41.760Z", ["machine1"])
        modelId, pId = getModelIdAndPId(assessmentId)
        fileName = "ScriptAutomation/Source1.csv"

    elif example == 2:
        datastreamId = createDatastream("iso_8601", "city")
        addDataToDatastream(datastreamId, "ScriptAutomation/weatherData0.csv")
        time.sleep(10)
        assessmentId = getAssessment(datastreamId)
        addFactsToAssessment(assessmentId, "iso_8601", "Asia/Calcutta", "city", "condition", "ScriptAutomation/weatherVerif.json")
        time.sleep(10)
        createModel(assessmentId, "2013-12-31T18:30:00.000Z", "2015-12-31T15:30:00.000Z", ["San Francisco"])
        modelId, pId = getModelIdAndPId(assessmentId)
        fileName = "ScriptAutomation/weatherData1.csv"
    #print(modelId, "\n", pId)

    state = checkStateOfModel(modelId, pId)
    print('State: ',state)
    while(state != 'COMPLETED' and state != 'FAILED'):
        time.sleep(5)
        state = checkStateOfModel(modelId, pId)
    
    if state == 'FAILED':
        print('Model learning failed')
        raise Exception()

    # print("Model is now Running.")

    # while(state != 'COMPLETED'):
    #     time.sleep(10)
    #     print('.')
    #     state = checkStateOfModel(modelId, pId)
        
    print('State: ', state)
    statusResponse["modelCreated"] = True
    statusResponse["assessmentId"] = assessmentId
    #applyModel(assessmentId, modelId)
    turnOnLiveMonitoring(datastreamId)
    time.sleep(10)
    statusResponse = {
        "datastream" : False,
        "addData" : False,
        "addFacts" : False,
        "modelCreated" : False,
        "liveMonitoring" : False,
        "assessmentId" : assessmentId
    }


def index(request):
    if request.method == "POST":
        global falkonry, host, token
        host = json.loads(request.body)["host"]
        token = json.loads(request.body)["token"]
        falkonry = Falkonry(host, token)
        print(host + " " + token)
        # print(falkonry)
        return JsonResponse([{"method":"POST"}], content_type="application/json", safe=False)
    elif request.method == "GET":
        print(request.method)
        url = host + "/assessment"
        r = requests.get(url,  headers = {
        'Authorization': 'Bearer ' + token
        })
        print(r.json())
        return JsonResponse(r.json(), content_type="application/json", safe=False)

def example(request):

    if request.method == "POST":
        example = json.loads(request.body)["example"]
        print(type(example))
        start(example)
        return JsonResponse([{"working": "yes"}], content_type="application/json", safe=False)
    else:

        return JsonResponse([{"working": "no"}], content_type="application/json", safe=False)

def status(request):

    return JsonResponse([statusResponse], content_type="application/json", safe=False)

def viewResults(request):
    pushAndPullLiveData()
    return JsonResponse([{}],  content_type="application/json", safe=False)

def delete(request):
    global host, datastreamId, token
    response=requests.delete(host + "/datastream/" + datastreamId, headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
        })
    return JsonResponse([{}],  content_type="application/json", safe=False)

