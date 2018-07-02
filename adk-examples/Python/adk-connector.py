from falkonryclient import client as Falkonry
from falkonryclient import schemas as Schemas
from fileAdapter import FileAdapter
from multiprocessing import Process
import io
import os
import json
import time as timepkg
import logging


logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s:%(levelname)s:%(message)s"
    )

class AddDataException(Exception):
    pass


class ADKconn:
    url = "https://dev.falkonry.ai"
    token = "7gjg7pjryg6mry2ypq6jbhgd9kg2rn2q"
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
                    return "SUCCESS"
            except:
                pass
            timepkg.sleep(5)

        if tracker_obj['status'] == 'PENDING':
            raise AddDataException()


    def postMoreDataFromStream(self, datastreamId, path, liveStatus):
        onlyfiles = [f for f in os.listdir(path) if ((os.path.isfile(os.path.join(path, f)) and ((os.path.splitext(f))[1] == ".csv") or (os.path.splitext(f))[1] == ".json"))]
        onlyfiles_length = len(onlyfiles)
        for i in range(onlyfiles_length):
            datastreamId = datastreamId
            file_adapter = FileAdapter()
            data, fileType = file_adapter.getData(path + "/" + onlyfiles[i])
            datastream = self.falkonry.get_datastream(datastreamId)
            options = {
                'streaming': liveStatus,
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

            if not liveStatus:
                for i in range(0, 3):
                    try:
                        inputResponse = self.falkonry.add_input_data(datastreamId, fileType, options, data)
                        status = self.checkDataIngestion(inputResponse)
                        if status == "SUCCESS":
                            break
                    except AddDataException:
                        logging.warning("Adding data failed! Retrying({})".format(i + 1))
                if i == 3:
                    raise Exception("Cannot add data to the datastream!")
            else:
                inputResponse = self.falkonry.add_input_data(datastreamId, fileType, options, data)

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


    def postData(self, datastreamId, data, fileType, liveStatus):
        datastreamId = datastreamId
        datastream = self.falkonry.get_datastream(datastreamId)

        options = {
        'streaming': liveStatus,
        'hasMoreData': False,
        'timeFormat': datastream.get_field().get_time().get_format(),
        'timeZone': datastream.get_field().get_time().get_zone(),
        'timeIdentifier': datastream.get_field().get_time().get_identifier(),
        # 'signalIdentifier': datastream.get_field().get_signal().get_signalIdentifier(),  ### Narrow Datastream Format
        # 'valueIdentifier': datastream.get_field().get_signal().get_valueIdentifier(),    ### Narrow Datastream Format
        # 'batchIdentifier': datastream.get_field().get_batchIdentifier(),                 ### Batch window type
        'entityIdentifier': datastream.get_field().get_entityIdentifier()
        }

        if not liveStatus:
            for i in range(0, 3):
                try:
                    inputResponse = self.falkonry.add_input_data(datastreamId, fileType, options, data)
                    status = self.checkDataIngestion(inputResponse)
                    if status == "SUCCESS":
                        break
                except AddDataException:
                    logging.warning("Adding data failed! Retrying({})".format(i + 1))
            if i == 3:
                raise Exception("Cannot add data to the datastream!")
        else:
            inputResponse = self.falkonry.add_input_data(datastreamId, fileType, options, data)


    def postDataFromStream(self, datastreamId, data, fileType, liveStatus):
        file_name = "simple_sliding_mixed_multi_entity_source_moreData.csv"
        datastreamId = datastreamId
        datastream = self.falkonry.get_datastream(datastreamId)
        options = {
            'streaming': liveStatus,
            'hasMoreData': False,
            'timeFormat': datastream.get_field().get_time().get_format(),
            'timeZone': datastream.get_field().get_time().get_zone(),
            'timeIdentifier': datastream.get_field().get_time().get_identifier(),
            # 'signalIdentifier': datastream.get_field().get_signal().get_signalIdentifier(),  ### Narrow Datastream Format
            # 'valueIdentifier': datastream.get_field().get_signal().get_valueIdentifier(),    ### Narrow Datastream Format
            # 'batchIdentifier': datastream.get_field().get_batchIdentifier(),                 ### Batch window type
            'entityIdentifier': datastream.get_field().get_entityIdentifier()
        }

        if not liveStatus:
            for i in range(0, 3):
                try:
                    inputResponse = self.falkonry.add_input_data(datastreamId, fileType, options, data)
                    status = self.checkDataIngestion(inputResponse)
                    if status == "SUCCESS":
                        break
                except AddDataException:
                    logging.warning("Adding data failed! Retrying({})".format(i + 1))
            if i == 3:
                raise Exception("Cannot add data to the datastream!")
        else:
            inputResponse = self.falkonry.add_input_data(datastreamId, fileType, options, data)


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



    def getLiveOutput(self, assessmentId):
        assessmentId = assessmentId
        stream = self.falkonry.get_output(assessmentId, None)
        for event in stream.events():
            logging.info(json.dumps(json.loads(event.data)))



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
    # liveStatus = True
    #
    # adk_conn = ADKconn()
    # datastreamId = adk_conn.createDataStream()
    # # datastreamId = "67r7y26cnncc8l"
    # adk_conn.postData(datastreamId, data, fileType, liveStatus)

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
    # liveStatus = True

    # adk_conn = ADKconn()
    # datastreamId = createDataStream()
    # adk_conn.postDataFromStream(datastreamId, data, fileType, liveStatus)

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

    fileAdapter = FileAdapter()
    fileName = "source1.csv"
    data, fileType = fileAdapter.getDataStream(fileName)
    liveStatus = True

    adk_conn = ADKconn()### For live stream input
    p1 = Process(target=adk_conn.getLiveOutput, args=("j7kbqmmwywy78j", ))
    p1.start()
    p2 = Process(target=adk_conn.postDataFromStream, args=("kc88g9knrylyvn", data, fileType, liveStatus))
    p2.start()
    
    p1.join()
    p2.join()


    ###########################################################################




    ############## For creating datastream and adding data from a folder containing multiple files ################
    """
    The below code will create a datastream and post the historical data as a stream from
    the folder containing multiple files to the datastream. You will have to give the folder path and pass it to the 
    postMoreHistoricalDataFromStream() in the adk connector
    """

    # path = "../demo-data"
    # liveStatus = True
    #
    # adk_conn = ADKconn()
    # datastreamId = adk_conn.createDataStream()
    # adk_conn.postMoreDataFromStream(datastreamId, path, liveStatus)

    ##############################################################################################################
