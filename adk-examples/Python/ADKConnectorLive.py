from falkonryclient import client as Falkonry
from falkonryclient import schemas as Schemas
from requests.exceptions import ChunkedEncodingError

from fileAdapter import FileAdapter
from multiprocessing import Process
import io
import os
import json
import time as timepkg
import logging
import sys


logging.basicConfig(level=logging.DEBUG, format="%(asctime)s:%(levelname)s:%(message)s")


class AddDataException(Exception):
    pass


class ADKconn:
    url = "https://example.falkonry.ai"
    token = "enter your token here"
    falkonry = Falkonry(url, token)
    datastream = Schemas.Datastream()
    datasource = Schemas.Datasource()
    field = Schemas.Field()
    time = Schemas.Time()
    signal = Schemas.Signal()
    datastreamId = None

    def ingestData(self, datastreamId, data, fileType):
        datastream = self.falkonry.get_datastream(datastreamId)

        options = {
            "streaming": True,  # NOTE: Streaming true since we are ingesting live data.
            "hasMoreData": False,
            "timeFormat": datastream.get_field().get_time().get_format(),
            "timeZone": datastream.get_field().get_time().get_zone(),
            "timeIdentifier": datastream.get_field().get_time().get_identifier(),
            # TODO: Uncomment these 2 lines out for Narrow Datastream Format.
            # 'signalIdentifier': datastream.get_field().get_signal().get_signalIdentifier(),
            # 'valueIdentifier': datastream.get_field().get_signal().get_valueIdentifier(),
            # TODO: Uncomment this line out for Batch window type.
            # 'batchIdentifier': datastream.get_field().get_batchIdentifier(),
            "entityIdentifier": datastream.get_field().get_entityIdentifier(),
        }

        inputResponse = self.falkonry.add_input_data(
            datastreamId, fileType, options, data
        )

    def ingestDataFromFile(self, datastreamId, data, fileType):
        datastream = self.falkonry.get_datastream(datastreamId)
        options = {
            "streaming": True,  # NOTE: Streaming true since we are ingesting live data.
            "hasMoreData": False,
            "timeFormat": datastream.get_field().get_time().get_format(),
            "timeZone": datastream.get_field().get_time().get_zone(),
            "timeIdentifier": datastream.get_field().get_time().get_identifier(),
            # TODO: Uncomment these 2 lines out for Narrow Datastream Format.
            # 'signalIdentifier': datastream.get_field().get_signal().get_signalIdentifier(),
            # 'valueIdentifier': datastream.get_field().get_signal().get_valueIdentifier(),
            # TODO: Uncomment this line out for Batch window type.
            # 'batchIdentifier': datastream.get_field().get_batchIdentifier(),
            "entityIdentifier": datastream.get_field().get_entityIdentifier(),
        }

        inputResponse = self.falkonry.add_input_data(
            datastreamId, fileType, options, data
        )

    def ingestDataFromFolder(self, datastreamId, path):
        # NOTE: You can also use this method by calling it again and again for multiple folders by changing the path.

        onlyfiles = [
            f
            for f in os.listdir(path)
            if (
                (
                    os.path.isfile(os.path.join(path, f))
                    and ((os.path.splitext(f))[1] == ".csv")
                    or (os.path.splitext(f))[1] == ".json"
                )
            )
        ]
        onlyfiles_length = len(onlyfiles)
        for i in range(onlyfiles_length):
            file_adapter = FileAdapter()
            data, fileType = file_adapter.getData(path + "/" + onlyfiles[i])
            datastream = self.falkonry.get_datastream(datastreamId)
            options = {
                "streaming": True,  # NOTE: Streaming true since we are ingesting live data.
                "hasMoredata": True,
                "timeFormat": datastream.get_field().get_time().get_format(),
                "timeZone": datastream.get_field().get_time().get_zone(),
                "timeIdentifier": datastream.get_field().get_time().get_identifier(),
                # TODO: Uncomment these 2 lines out for Narrow Datastream Format.
                # 'signalIdentifier': datastream.get_field().get_signal().get_signalIdentifier(),
                # 'valueIdentifier': datastream.get_field().get_signal().get_valueIdentifier(),
                # TODO: Uncomment this line out for Batch window type.
                # 'batchIdentifier': datastream.get_field().get_batchIdentifier(),
                "entityIdentifier": datastream.get_field().get_entityIdentifier(),
            }
            if i == onlyfiles_length - 1:
                options["hasMoreData"] = False
            inputResponse = self.falkonry.add_input_data(
                datastreamId, fileType, options, data
            )

    def getLiveOutput(self, assessmentId):
        while True:
            try:
                stream = self.falkonry.get_output(assessmentId, None)
                for event in stream.events():
                    logging.info(json.dumps(json.loads(event.data)))
            except (ConnectionError, ChunkedEncodingError):  # these are known errors
                logging.info("Ignoring: " + str(sys.exc_info()[0]))
                pass
            except:
                logging.info(sys.exc_info())
                pass


if __name__ == "__main__":

    # File adapter will be used to get the appropriate data from the different files and to provide it
    # in the format in which we can send to the ADK methods.

    ################### For live data input and output #########################
    """
    The below code will run both the functions of adding live input and getting
    live output simultaneously. You will have to enter the fileName from where
    you are getting the live data and pass it to the get_data_stream() method of
    the file adapter.

    NOTE:-
    1. Go on the Falkonry UI and build a model.
    2. After building a model click LIVE(OFF) button to turn on the LIVE INPUT
    3. This is only a example. Change this as per your workflow.
    """

    # fileAdapter = FileAdapter()
    # fileName = "source1.csv"
    # data, fileType = fileAdapter.getDataStream(fileName)
    #
    # ## For live stream input
    #
    # assessmentId = "assesmentId Here"
    # datastreamId = "datastreamId Here"
    #
    # adk_conn = ADKconn()
    # p1 = Process(target=adk_conn.getLiveOutput, args=(assessmentId, ))
    # p1.start()
    # p2 = Process(target=adk_conn.ingestDataFromFile, args=(datastreamId, data, fileType))
    # p2.start()
    #
    # p1.join()
    # p2.join()

    ###########################################################################
