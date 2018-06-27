from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from falkonryclient import client as Falkonry
from falkonryclient import schemas as Schemas
import random, io, requests, time, json, sys

#instantiate Falkonry
# host = 'https://dev.falkonry.ai'
# token = 'p6qvt9mlcplyjq2ygn972q6n9g8mmdnq'
falkonry = None
host = None
token = None
# dataPath, factsPath = sys.argv

#create Datastream
def createDatastream(timeFormat, entityIdentifier):

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
    
    # print(datastream.get_name())
    # print(datastream.get_field().get_entityIdentifier())    
    print("Creating Datastream...")
    createdDatastream = falkonry.create_datastream(datastream)
    datastreamId = createdDatastream.get_id()
    # print(datastream.get_name())
    return datastreamId

# add data to datastream
def addDataToDatastream(datastreamId, filePath):
    stream = io.open(filePath)

    options = {'streaming': False,
               'hasMoreData': False}

    print("Adding data...")
    inputResponse = falkonry.add_input_stream(datastreamId, 'csv', options, stream)
    print(inputResponse)
    

# get the created assessment
def getAssessment(datastreamId):
    assessmentResponse = falkonry.get_assessments()
    assessmentId = None

    for assessment in assessmentResponse:
        if assessment.get_datastream() == datastreamId:
            assessmentId = assessment.get_id()

    return assessmentId

#add facts to the assessment
def addFactsToAssessment(assessmentId, timeFormat, timeZone, entityIdentifier, valueIdentifier, filePath):    
    stream = io.open(filePath)
    options = {
      'startTimeIdentifier': "time",
      'endTimeIdentifier': "end",
      'timeFormat': timeFormat,
      'timeZone': timeZone,
      'entityIdentifier': entityIdentifier,
      'valueIdentifier': valueIdentifier
    }

    print("Adding facts...")
    if filePath.endswith('.csv'):
        response = falkonry.add_facts_stream(assessmentId, 'csv', options, stream)
    elif filePath.endswith('.json'):
        response = falkonry.add_facts_stream(assessmentId, 'json', options, stream)
    print(response)
    


# create a model
def createModel(assessmentId, startTime, endTime, entityList):
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
    response = falkonry.on_datastream(datastreamId)


def start(example):

    if example == "HumanActivity":
        datastreamId = createDatastream("millis", "person")
        addDataToDatastream(datastreamId, "ScriptAutomation/source1.csv")
        time.sleep(10)
        assessmentId = getAssessment(datastreamId)
        addFactsToAssessment(assessmentId, "millis", "GMT", "person", "activity", "ScriptAutomation/partialVerification1.csv")
        time.sleep(10)
        createModel(assessmentId, "2017-04-12T06:47:28.469Z", "2017-04-12T06:54:08.429Z", ["p1"])
        modelId, pId = getModelIdAndPId(assessmentId)

    elif example == "Weather":
        datastreamId = createDatastream("iso_8601", "city")
        addDataToDatastream(datastreamId, "ScriptAutomation/weatherData.csv")
        time.sleep(10)
        assessmentId = getAssessment(datastreamId)
        addFactsToAssessment(assessmentId, "iso_8601", "Asia/Calcutta", "city", "condition", "ScriptAutomation/weatherVerif.json")
        time.sleep(10)
        createModel(assessmentId, "2013-12-31T18:30:00.000Z", "2015-12-31T15:30:00.000Z", ["San Francisco"])
        modelId, pId = getModelIdAndPId(assessmentId)
    #print(modelId, "\n", pId)

    state = checkStateOfModel(modelId, pId)
    print('State: ',state)
    while(state != 'COMPLETED' and state != 'FAILED'):
        time.sleep(5)
        state = checkStateOfModel(modelId, pId)
    
    if state == 'FAILED':
        print('Model learning failed')
        raise "failed"

    # print("Model is now Running.")

    # while(state != 'COMPLETED'):
    #     time.sleep(10)
    #     print('.')
    #     state = checkStateOfModel(modelId, pId)
        
    print('State: ', state)
    #applyModel(assessmentId, modelId)
    turnOnLiveMonitoring(datastreamId)

def index(request):
    if request.method == "POST":
        global falkonry, host, token
        host = json.loads(request.body)["host"]
        token = json.loads(request.body)["token"]
        falkonry = Falkonry(host, token)
        print(host + " " + token)
        return JsonResponse([{"working": "yes"}], content_type="application/json", safe=False)
    else:
        print(request.method)
        return JsonResponse([{"working": "no"}], content_type="application/json", safe=False)

def example(request):

    if request.method == "POST":
        example = json.loads(request.body)["example"]
        print(example)
        start(example)
        return JsonResponse([{"working": "yes"}], content_type="application/json", safe=False)

    else:

        return JsonResponse([{"working": "no"}], content_type="application/json", safe=False)

# "startTime": "2017-04-12T06:47:28.469Z",
# "endTime": "2017-04-12T06:54:08.429Z"