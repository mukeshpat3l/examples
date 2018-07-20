from falkonryclient import client as Falkonry
from falkonryclient import schemas as Schemas
from requests.exceptions import ChunkedEncodingError
from fileAdapter import FileAdapter
from multiprocessing import Process
import os
import json
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
        """
        Adding historical data to an existing datastream.

        :param datastreamId: The id of an existing datastream
                            or received from the
                         createDatastream method.
        :param data: This is the stream received
                      from file adapters getData()
                      method.
        :param fileType: We need to mention which type of file it is
                       i.e. csv/json.
        """

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
        """
        Adding historical data stream to an existing datastream.

        :param datastreamId: The id of an existing datastream
                            or received from the
                            createDatastream method.
        :param data: This is the stream received
                      from file adapters getDataStream()
                      method.
        :param fileType: We need to mention which type of file it is
                        i.e. csv/json.
        """

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
        """
        This method is just an example to show how our ADK manages
        multiple data files in a particular folder. It reads all
        the files and passes each one of them as a stream to an existing
        datastream.

        NOTE: You can also use this method by calling it again and again for multiple folders by changing the path.

        :param datastreamId: The id of an existing datastream
                            or received from the
                            createDatastream method.
        :param path: Complete folder path where the data files
                          are stored.
        """

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
        """
        This method is used get the streaming output or live data
        output which is only visible if there is a live datastream
        on or by calling our postRealTimeData method and this method
        can only be used if you have trained a model on Falkonry UI
        and then turned ON LIVE button on Falkonry UI.


        :param assessmentId: This ID you can find in the Assesment tab
                              after you have trained a model.
        """

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

    fileAdapter = FileAdapter()
    fileName = "file name"
    data, fileType = fileAdapter.getDataStream(fileName)

    assessmentId = "assesmentId Here"
    datastreamId = "datastreamId Here"

    adk_conn = ADKconn()
    p1 = Process(target=adk_conn.getLiveOutput, args=(assessmentId, ))
    p1.start()
    p2 = Process(target=adk_conn.ingestDataFromFile, args=(datastreamId, data, fileType))
    p2.start()

    p1.join()
    p2.join()

    ###########################################################################
