from falkonryclient import client as Falkonry
from falkonryclient import schemas as Schemas
from fileAdapter import FileAdapter
from multiprocessing import Process
import pandas as pd
import io
import os
import json
import time as timepkg



class ADKconnector:



    url = "https://dev.falkonry.ai"
    token = "7gjg7pjryg6mry2ypq6jbhgd9kg2rn2q"
    falkonry   = Falkonry(url, token)
    datastream = Schemas.Datastream()
    datasource = Schemas.Datasource()
    field = Schemas.Field()
    time = Schemas.Time()
    signal = Schemas.Signal()
    datastream_id = None


    def checkDataIngestion(self, tracker):
        tracker_obj = None
        for i in range(0, 12):
            tracker_obj = self.falkonry.get_status(tracker['__$id'])
            print(tracker_obj['status'])
            try:
                if tracker_obj['status'] == 'FAILED' or tracker_obj['status'] == 'ERROR':
                    raise Exception()
                if tracker_obj['status'] == 'COMPLETED' or tracker_obj['status'] == 'SUCCESS':
                    print("Data added successfully.")
                    break
            except:
                print("Cannot add data to datastream.")
            timepkg.sleep(5)

        if tracker_obj['status'] == 'FAILED' or tracker_obj['status'] == 'PENDING':
            print("Cannot add data to datastream. Please try again.")


    def addMoreHistoricalDataFromStream(self, datastream_id, path):
        onlyfiles = [f for f in os.listdir(path) if ((os.path.isfile(os.path.join(path, f)) and (os.path.splitext(f))[1] == ".csv"))]
        onlyfiles_length = len(onlyfiles)
        for i in range(onlyfiles_length):
            datastream_id = datastream_id
            file_adapter = FileAdapter()
            stream, fileType = file_adapter.get_data(path + "/" + onlyfiles[i])
            datastream = self.falkonry.get_datastream(datastream_id)
            options = {
                'streaming': False,
                'hasMoredata': True,
                'timeFormat': datastream.get_field().get_time().get_format(),
                'timeZone': datastream.get_field().get_time().get_zone(),
                'timeIdentifier': datastream.get_field().get_time().get_identifier(),
                # 'signalIdentifier': datastream.get_field().get_signal().get_signalIdentifier(),  ### Narrow Datastream Format
                # 'valueIdentifier': datastream.get_field().get_signal().get_valueIdentifier(),    ### Narrow Datastream Format
                # 'batchIdentifier': datastream.get_field().get_batchIdentifier(),                 ### Batch window type
                'entityIdentifier': datastream.get_field().get_entityIdentifier()
            }

            if i == onlyfiles_length - 1:
                options["hasMoreData"] = False
            inputResponse = self.falkonry.add_input_data(datastream_id, fileType, options, stream)
            self.checkDataIngestion(inputResponse)

    def createDataStream(self):
        name = "ExTest"
        self.datastream.set_name(name)

        timezone = 'GMT'
        self.time.set_zone(timezone)

        timeIdentifier = "time"
        self.time.set_identifier(timeIdentifier)

        self.time.set_format("millis")

        precisionFormat = 'millis'
        self.datastream.set_time_precision(precisionFormat)

        self.field.set_time(self.time)
        self.field.set_signal(self.signal)
        self.datasource.set_type("STANDALONE")
        self.datastream.set_datasource(self.datasource)
        self.datastream.set_field(self.field)

        entityName = "person"
        self.field.set_entityIdentifier(entityName)

        ##############  For narrow datastream format ################
        # signalIdentifier = "signal"
        # valueIdentifier = "value"
        # signal.set_signalIdentifier(signalIdentifier)
        # signal.set_valueIdentifier(valueIdentifier)

        ################  For batch window Type  ###################
        # batchIdentifier = "batch_id"
        # field.set_batchIdentifier(batchIdentifier)

        createdDataStream = self.falkonry.create_datastream(self.datastream)
        datastream_id = createdDataStream.get_id()
        return datastream_id


    def postHistoricalData(self, datastream_id, data, fileType):
        datastream_id = datastream_id
        datastream = self.falkonry.get_datastream(datastream_id)

        options = {
        'streaming': False,
        'hasMoreData': False,
        'timeFormat': datastream.get_field().get_time().get_format(),
        'timeZone': datastream.get_field().get_time().get_zone(),
        'timeIdentifier': datastream.get_field().get_time().get_identifier(),
        # 'signalIdentifier': datastream.get_field().get_signal().get_signalIdentifier(),  ### Narrow Datastream Format
        # 'valueIdentifier': datastream.get_field().get_signal().get_valueIdentifier(),    ### Narrow Datastream Format
        # 'batchIdentifier': datastream.get_field().get_batchIdentifier(),                 ### Batch window type
        'entityIdentifier': datastream.get_field().get_entityIdentifier()
        }

        inputResponse = self.falkonry.add_input_data(datastream_id, fileType, options, data)
        self.checkDataIngestion(inputResponse)

    def postHistoricalDataStream(self, datastream_id, data, fileType):
        file_name = "source0.csv"
        datastream_id = datastream_id
        datastream = self.falkonry.get_datastream(datastream_id)
        options = {
            'streaming': False,
            'hasMoreData': False,
            'timeFormat': datastream.get_field().get_time().get_format(),
            'timeZone': datastream.get_field().get_time().get_zone(),
            'timeIdentifier': datastream.get_field().get_time().get_identifier(),
            # 'signalIdentifier': datastream.get_field().get_signal().get_signalIdentifier(),  ### Narrow Datastream Format
            # 'valueIdentifier': datastream.get_field().get_signal().get_valueIdentifier(),    ### Narrow Datastream Format
            # 'batchIdentifier': datastream.get_field().get_batchIdentifier(),                 ### Batch window type
            'entityIdentifier': datastream.get_field().get_entityIdentifier()
        }

        inputResponse = self.falkonry.add_input_stream(datastream_id, fileType, options, data)
        self.checkDataIngestion(inputResponse)


    def postRealtimeData(self, datastream_id, data, fileType):
        file_name = "source.csv"
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
        #     inputResponse = self.falkonry.add_input_stream(datastream_id, fileType, options, stream)
        #     df = pd.read_csv(fileName + str(i) + fileExtension)
        #     time_colm = df.loc[:, "time"]
        #     prev_time = df.loc[len(df) - 1, "time"]
        #     time_difference = df.loc[1, "time"] - df.loc[0, "time"]
        #     for j in range(len(time_colm)):
        #         if j == 0:
        #             df.loc[j, "time"] = prev_time + time_difference
        #         else:
        #             df.loc[j, "time"] = df.loc[j - 1, "time"] + time_difference
        
        #     df = df.loc[:, ]
        #     df.to_csv(fileName + str(i + 1) + fileExtension, index=False)

        inputResponse = self.falkonry.add_input_stream(datastream_id, fileType, options, data)
        print(inputResponse)



    def getLiveOutput(self, assessmentId):
        assessmentId = assessmentId
        stream = self.falkonry.get_output(assessmentId, None)
        for event in stream.events():
            print(json.dumps(json.loads(event.data)))



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

    fileAdapter = FileAdapter()
    fileName = "source0.csv"
    data, fileType = fileAdapter.get_data_stream(fileName)

    
    adk_conn = ADKconnector()
    datastream_id = adk_conn.createDataStream()
    adk_conn.postHistoricalDataStream(datastream_id, data, fileType)
    adk_conn.postRealtimeData(datastream_id, data, fileType)

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
    # p1 = Process(target=adk_conn.getLiveOutput, args=(assessmentId, ))
    # p1.start()
    # p2 = Process(target=adk_conn.postRealtimeData, args=(datastream_id, data, fileType))
    # p2.start()
    #
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