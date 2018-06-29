from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from falkonryclient import client as Falkonry
from falkonryclient import schemas as Schemas
from fileAdapter import FileAdapter
from multiprocessing import Process
import pandas as pd
import random, io, requests, time, json, sys, os

#instantiate Falkonry
falkonry = None
host = None
token = None
statusResponse = {
    "datastream" : False,
    "addData" : False,
    "addFacts" : False,
    "modelCreated" : False,
    "liveMonitoring" : False
}
# dataPath, factsPath = sys.argv


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
    global statusResponse
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

    statusResponse["datastream"] = True
    return datastreamId

# add data to datastream
def addDataToDatastream(datastreamId, filePath):
    global statusResponse
    stream = io.open(filePath)

    options = {'streaming': False,
               'hasMoreData': False}

    print("Adding data...")
    inputResponse = falkonry.add_input_stream(datastreamId, 'csv', options, stream)
    checkDataIngestion(inputResponse)
    statusResponse["addData"] = True
    
# def addMoreHistoricalDataFromStream(self, datastream_id, path):
#         onlyfiles = [f for f in os.listdir(path) if ((os.path.isfile(os.path.join(path, f)) and (os.path.splitext(f))[1] == ".csv"))]
#         onlyfiles_length = len(onlyfiles)
#         for i in range(onlyfiles_length):
#             datastream_id = datastream_id
#             # file_adapter = FileAdapter()
#             # stream, fileType = file_adapter.get_data(path + "/" + onlyfiles[i])
#             datastream = self.falkonry.get_datastream(datastream_id)
#             options = {
#                 'streaming': False,
#                 'hasMoredata': True,
#                 'timeFormat': datastream.get_field().get_time().get_format(),
#                 'timeZone': datastream.get_field().get_time().get_zone(),
#                 'timeIdentifier': datastream.get_field().get_time().get_identifier(),
#                 # 'signalIdentifier': datastream.get_field().get_signal().get_signalIdentifier(),  ### Narrow Datastream Format
#                 # 'valueIdentifier': datastream.get_field().get_signal().get_valueIdentifier(),    ### Narrow Datastream Format
#                 # 'batchIdentifier': datastream.get_field().get_batchIdentifier(),                 ### Batch window type
#                 'entityIdentifier': datastream.get_field().get_entityIdentifier()
#             }

#             if i == onlyfiles_length - 1:
#                 options["hasMoreData"] = False
#             inputResponse = falkonry.add_input_data(datastream_id, fileType, options, stream)
#             self.checkDataIngestion(inputResponse)


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
    global statusResponse    
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


def postRealtimeData(self, datastream_id, data, fileType):
        file_name = "simple_sliding_mixed_multi_entity_source_moreData.csv"
        datastream_id = datastream_id

        datastream = self.falkonry.get_datastream(datastream_id)
        options = {
            'streaming': True,
            'hasMoreData': False,
            'timeFormat': datastream.get_field().get_time().get_format(),
            'timeZone': datastream.get_field().get_time().get_zone(),
            'timeIdentifier': datastream.get_field().get_time().get_identifier(),
            # 'signalIdentifier': datastream.get_field().get_signal().get_signalIdentifier(),  ### Narrow Datastream Format
            # 'valueIdentifier': datastream.get_field().get_signal().get_valueIdentifier(),    ### Narrow Datastream Format
            # 'batchIdentifier': datastream.get_field().get_batchIdentifier(),                 ### Batch window type
            'entityIdentifier': datastream.get_field().get_entityIdentifier()
        }

        # for i in range(5):
        #     fileName, fileExtension = os.path.splitext(file_name)
        #     stream = io.open(fileName + str(i) + fileExtension)
        #     inputResponse = falkonry.add_input_stream(datastream_id, fileType, options, stream)
        #     df = pd.read_csv(fileName + str(i) + fileExtension)
        #     time_colm = df.loc[:, "time"]
        #     prev_time = df.loc[len(df) - 1, "time"]
        #     time_difference = df.loc[1, "time"] - df.loc[0, "time"]
        #     for j in range(len(time_colm)):
        #         if j == 0:
        #             df.loc[j, "time"] = prev_time + time_difference
        #         else:
        #             df.loc[j, "time"] = df.loc[j - 1, "time"] + time_difference
        #
        #     df = df.loc[:, ]
        #     df.to_csv(fileName + str(i + 1) + fileExtension, index=False)

        inputResponse = self.falkonry.add_input_stream(datastream_id, fileType, options, data)
        print(inputResponse)

def getLiveOutput(self, assessmentId):
        assessmentId = assessmentId
        stream = self.falkonry.get_output(assessmentId, None)
        for event in stream.events():
            print(json.dumps(json.loads(event.data)))

def start(example):
    global statusResponse
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
    statusResponse["modelCreated"] = True
    #applyModel(assessmentId, modelId)
    turnOnLiveMonitoring(datastreamId)
    time.sleep(10)
    statusResponse = {
        "datastream" : False,
        "addData" : False,
        "addFacts" : False,
        "modelCreated" : False,
        "liveMonitoring" : False
    }

def index(request):
    if request.method == "POST":
        global falkonry, host, token
        host = json.loads(request.body)["host"]
        token = json.loads(request.body)["token"]
        falkonry = Falkonry(host, token)
        print(host + " " + token)
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
        print(example)
        start(example)
        return JsonResponse([{"working": "yes"}], content_type="application/json", safe=False)
    else:

        return JsonResponse([{"working": "no"}], content_type="application/json", safe=False)

def test(request):

    return JsonResponse([statusResponse], content_type="application/json", safe=False)



if __name__ == "__main__":

    # File adapter will be used to get the appropriate data from the different files and to provide it
    # in the format in which we can send to the ADK methods.


    #################### For creating datastream and adding historical data ################
    """
    The below code will create a datastream and post the historical data as a string to the
    datastream. You will have to give the data as a string or give the fileName and pass it 
    to the get_data() method of the file adapter.
    """

    # fileAdapter = FileAdapter()
    # fileName = "simple_sliding_mixed_multi_entity_source_moreData.csv"
    # data, fileType = fileAdapter.get_data(fileName)

    # datastream_id = createDataStream()
    # adk_conn = ADKconnector()
    # adk_conn.postHistoricalData(datastream_id, data, fileType)

    ########################################################################################





    ############### For creating datastream and adding historical data from a stream ################
    """
    The below code will create a datastream and post the historical data as a stream from
    the file to the datastream. You will have to give the fileName and pass it to the 
    get_data_stream() method of the file adapter.
    """

    # fileAdapter = FileAdapter()
    # fileName = "simple_sliding_mixed_multi_entity_source_moreData.csv"
    # data, fileType = fileAdapter.get_data_stream(fileName)

    # datastream_id = createDataStream()
    # adk_conn = ADKconnector()
    # adk_conn.postHistoricalDataStream(datastream_id, data, fileType)

    ###############################################################################################




    ################### For live data input and output #########################
    """
    The below code will run both the functions of adding live input and getting
    live output simultaneously. You will have to enter the fileName from where
    you are getting the live data and pass it to the get_data_stream() method of
    the file adapter.
    """

    # fileAdapter = FileAdapter()
    # fileName = "simple_sliding_mixed_multi_entity_source_moreData.csv"
    # data, fileType = fileAdapter.get_data_stream(fileName)

    # adk_conn = ADKconnector()
    # postLiveData(datastream_id, data, fileType)  ### For live stream input
    # p1 = Process(target=getLiveOutput, args=(assessmentId, ))
    # p1.start()
    # p2 = Process(target=postRealtimeData, args=(datastream_id, data, fileType))
    # p2.start()
    
    # p1.join()
    # p2.join()


    ###########################################################################




    ############## For creating datastream and adding data from a folder containing multiple files ################
    """
    The below code will create a datastream and post the historical data as a stream from
    the folder containing multiple files to the datastream. You will have to give the folder path and pass it to the 
    addMoreHistoricalDataFromStream() in the adk connector
    """
    # path = "../demo-data"

    # datastream_id = createDataStream()
    # adk_conn = ADKconnector()
    # adk_conn.postHistoricalDataFromStream(datastream_id, path)

    ##############################################################################################################


# def sendAssessment():
#     url = host + "/assessment"
#     r = requests.get(url,  headers = {
#         'Authorization': 'Bearer ' + token
#         })
    
#     return JsonResponse(r.json(), content_type="application/json", safe=False)
# "startTime": "2017-04-12T06:47:28.469Z",
# "endTime": "2017-04-12T06:54:08.429Z"