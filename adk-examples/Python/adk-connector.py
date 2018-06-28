from falkonryclient import client as Falkonry
from falkonryclient import schemas as Schemas
from fileAdapter import FileAdapter
from multiprocessing import Process
import pandas as pd
import io
import os
import json
import time as timepkg
import logging

# Logging configuration
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s:%(levelname)s:%(message)s"
    )




class ADKconn:
    url = "https://example.falkonry.ai"  ### Your account url
    token = "token"                      ### Your account token
    falkonry   = Falkonry(url, token)
    datastream = Schemas.Datastream()
    datasource = Schemas.Datasource()
    field = Schemas.Field()
    time = Schemas.Time()
    signal = Schemas.Signal()
    datastreamId = None


    def checkDataIngestion(self, tracker):
        tracker_obj = None
        for i in range(0, 12):
            tracker_obj = self.falkonry.get_status(tracker['__$id'])
            logging.info(tracker_obj['status'])
            try:
                if tracker_obj['status'] == 'FAILED' or tracker_obj['status'] == 'ERROR':
                    raise Exception()
                if tracker_obj['status'] == 'COMPLETED' or tracker_obj['status'] == 'SUCCESS':
                    logging.info("Data added successfully.")
                    break
            except:
                logging.warning("Cannot add data to datastream.")
            timepkg.sleep(5)

        if tracker_obj['status'] == 'FAILED' or tracker_obj['status'] == 'PENDING':
            logging.error("Cannot add data to datastream. Please try again.")


    def postMoreHistoricalDataFromStream(self, datastreamId, path):
        onlyfiles = [f for f in os.listdir(path) if ((os.path.isfile(os.path.join(path, f)) and (os.path.splitext(f))[1] == ".csv"))]
        onlyfiles_length = len(onlyfiles)
        for i in range(onlyfiles_length):
            datastreamId = datastreamId
            file_adapter = FileAdapter()
            stream, fileType = file_adapter.getData(path + "/" + onlyfiles[i])
            datastream = self.falkonry.get_datastream(datastreamId)
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
            inputResponse = self.falkonry.add_input_data(datastreamId, fileType, options, stream)
            self.checkDatprintaIngestion(inputResponse)

    def createDataStream(self):
        name = "SL_MIXED_MUL_PY_1232763"
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

        entityName = "entity"
        self.field.set_entityIdentifier(entityName)

        ##############  For narrow datastream format ################
        # signalIdentifier = "signal"
        # valueIdentifier = "value"
        # self.signal.set_signalIdentifier(signalIdentifier)
        # self.signal.set_valueIdentifier(valueIdentifier)

        ################  For batch window Type  ###################
        # batchIdentifier = "batch_id"
        # self.field.set_batchIdentifier(batchIdentifier)

        createdDataStream = self.falkonry.create_datastream(self.datastream)
        datastreamId = createdDataStream.get_id()
        return datastreamId


    def postHistoricalData(self, datastreamId, data, fileType):
        datastreamId = datastreamId
        datastream = self.falkonry.get_datastream(datastreamId)

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

        inputResponse = self.falkonry.add_input_data(datastreamId, fileType, options, data)
        self.checkDataIngestion(inputResponse)

    def postHistoricalDataFromStream(self, datastreamId, data, fileType):
        file_name = "simple_sliding_mixed_multi_entity_source_moreData.csv"
        datastreamId = datastreamId
        datastream = self.falkonry.get_datastream(datastreamId)
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

        inputResponse = self.falkonry.add_input_stream(datastreamId, fileType, options, data)
        self.checkDataIngestion(inputResponse)


    def postRealtimeData(self, datastreamId, data, fileType):
        file_name = "simple_sliding_mixed_multi_entity_source_moreData.csv"
        datastreamId = datastreamId

        datastream = self.falkonry.get_datastream(datastreamId)
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
        #     inputResponse = self.falkonry.add_input_stream(datastreamId, fileType, options, stream)
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
        #
        #     df.to_csv(fileName + str(i + 1) + fileExtension, index=False)

        inputResponse = self.falkonry.add_input_stream(datastreamId, fileType, options, data)
        logging.info(inputResponse)



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
    # fileName = "SL_MIXED_MUL_PY_12345.json"
    # data, fileType = fileAdapter.getData(fileName)
    #
    # adk_conn = ADKconn()
    # datastreamId = adk_conn.createDataStream()
    # adk_conn.postHistoricalData(datastreamId, data, fileType)

    ########################################################################################





    ############### For creating datastream and adding historical data from a stream ################
    """
    The below code will create a datastream and post the historical data as a stream from
    the file to the datastream. You will have to give the fileName and pass it to the
    get_data_stream() method of the file adapter.
    """

    # fileAdapter = FileAdapter()
    # fileName = "simple_sliding_mixed_multi_entity_source_moreData.csv"
    # data, fileType = fileAdapter.getDataStream(fileName)

    # adk_conn = ADKconn()
    # datastreamId = createDataStream()
    # adk_conn.postHistoricalDataFromStream(datastreamId, data, fileType)

    ###############################################################################################




    ################### For live data input and output #########################
    """
    The below code will run both the functions of adding live input and getting
    live output simultaneously. You will have to enter the fileName from where
    you are getting the live data and pass it to the get_data_stream() method of
    the file adapter.

    NOTE:-
    1. Go on the Falkonry UI and build a model.
    2. After building a model click LIVE(OFF) button to turn on the LIVE INPUT
    """

    # fileAdapter = FileAdapter()
    # fileName = "simple_sliding_mixed_multi_entity_source_moreData.csv"
    # data, fileType = fileAdapter.getDataStream(fileName)

    # adk_conn = ADKconn()
    # postLiveData(datastreamId, data, fileType)  ### For live stream input
    # p1 = Process(target=adk_conn.getLiveOutput, args=(assessmentId, ))
    # p1.start()
    # p2 = Process(target=adk_conn.postRealtimeData, args=(datastreamId, data, fileType))
    # p2.start()
    #
    # p1.join()
    # p2.join()


    ###########################################################################




    ############## For creating datastream and adding data from a folder containing multiple files ################
    """
    The below code will create a datastream and post the historical data as a stream from
    the folder containing multiple files to the datastream. You will have to give the folder path and pass it to the
    postMoreHistoricalDataFromStream() in the adk connector
    """
    # path = "../demo-data"
    #
    # adk_conn = ADKconn()
    # datastreamId = adk_conn.createDataStream()
    # adk_conn.postMoreHistoricalDataFromStream(datastreamId, path)

    ##############################################################################################################
