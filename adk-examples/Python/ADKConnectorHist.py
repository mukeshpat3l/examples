from falkonryclient import client as Falkonry
from falkonryclient import schemas as Schemas
from fileAdapter import FileAdapter
import os
import time as timepkg
import logging
import pandas as pd


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

    def checkDataIngestion(self, tracker):
        """
        This method is used to check whether the data is successfully ingested or not.

        :param tracker: It takes the data returned from
                         the add_input_data() function.
        :raises Exception: When the data addition is
                             fails each time in a loop.
        :raises AddDataException: When the data cannot be added in one complete try.
        """

        tracker_obj = None
        for i in range(0, 12):
            tracker_obj = self.falkonry.get_status(tracker["__$id"])
            logging.info(tracker_obj["status"])
            try:
                if (
                    tracker_obj["status"] == "FAILED"
                    or tracker_obj["status"] == "ERROR"
                ):
                    raise Exception()
                if (
                    tracker_obj["status"] == "COMPLETED"
                    or tracker_obj["status"] == "SUCCESS"
                ):
                    logging.info("Data added successfully.")
                    return "SUCCESS"
            except:
                pass
            timepkg.sleep(5)

        if tracker_obj["status"] == "PENDING":
            raise AddDataException()

    def createDataStream(self):
        """
        Creates a new datastream on the Falkonry UI.

        :returns: Datastream ID.
        """

        name = "SL_MIXED_MUL_PY_12327"
        self.datastream.set_name(name)

        timezone = "GMT"
        self.time.set_zone(timezone)

        timeIdentifier = "time"
        self.time.set_identifier(timeIdentifier)

        self.time.set_format("millis")

        precisionFormat = "millis"
        self.datastream.set_time_precision(precisionFormat)

        self.field.set_time(self.time)
        self.field.set_signal(self.signal)
        self.datasource.set_type("STANDALONE")
        self.datastream.set_datasource(self.datasource)
        self.datastream.set_field(self.field)

        entityName = "entity"
        self.field.set_entityIdentifier(entityName)

        ##############  For narrow datastream format ################
        # TODO: Uncomment these lines out for Narrow Datastream Format.
        # signalIdentifier = "signal"
        # valueIdentifier = "value"
        # self.signal.set_signalIdentifier(signalIdentifier)
        # self.signal.set_valueIdentifier(valueIdentifier)

        ################  For batch window Type  ###################
        # TODO: Uncomment this line out for Batch window type.
        # batchIdentifier = "batch_id"
        # self.field.set_batchIdentifier(batchIdentifier)

        createdDataStream = self.falkonry.create_datastream(self.datastream)
        datastreamId = createdDataStream.get_id()
        return datastreamId

    def ingestData(self, datastreamId, data, fileType):
        """
        Adding historical data to an existing datastream.

        :param datastreamId: The id of an existing datastream
                             or received from the
                             createDatastream method.
        :param data: This is the stream received
                      from file adapters getData()
                      method.
        :param fileType:  We need to mention which type of file it is
                          i.e. csv/json.
        :raises Exception: When the data cannot be added to the datastream.
        """

        datastream = self.falkonry.get_datastream(datastreamId)

        options = {
            "streaming": False,
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

        i = 0
        for i in range(0, 3):
            try:
                inputResponse = self.falkonry.add_input_data(
                    datastreamId, fileType, options, data
                )
                status = self.checkDataIngestion(inputResponse)
                if status == "SUCCESS":
                    break
            except AddDataException:
                logging.warning("Adding data failed! Retrying({})".format(i + 1))
        if i == 3:
            raise Exception("Cannot add data to the datastream!")

    def ingestDataFromFile(self, datastreamId, data, fileType):
        """
        Adding historical data stream to an existing datastream.

        :param datastreamId: The id of an existing datastream
                             or received from the
                             createDatastream method.
        :param data: This is the stream received
                     from file adapters getDataStream()
                     method.
        :param fileType:  We need to mention which type of file it is
                          i.e. csv/json.
        :raises Exception: When the data cannot be added to the datastream.
        """

        datastream = self.falkonry.get_datastream(datastreamId)
        options = {
            "streaming": False,
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

        i = 0
        for i in range(0, 3):
            try:
                inputResponse = self.falkonry.add_input_data(
                    datastreamId, fileType, options, data
                )
                status = self.checkDataIngestion(inputResponse)
                if status == "SUCCESS":
                    break
            except AddDataException:
                logging.warning("Adding data failed! Retrying({})".format(i + 1))
        if i == 3:
            raise Exception("Cannot add data to the datastream!")

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
        :raises Exception: When the data cannot be added to the datastream.
        """

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
                "streaming": False,
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

            for i in range(0, 3):
                try:
                    inputResponse = self.falkonry.add_input_data(
                        datastreamId, fileType, options, data
                    )
                    status = self.checkDataIngestion(inputResponse)
                    if status == "SUCCESS":
                        break
                except AddDataException:
                    logging.warning("Adding data failed! Retrying({})".format(i + 1))
            if i == 3:
                raise Exception("Cannot add data to the datastream!")

    def ingestFactsData(self, datastreamId, assessmentId, data, fileType):
        """
        This method adds facts to an existing assessment.

        :param datastreamId: The ID of an existing datastream.
        :param assessmentId: The ID of an existing assessment.
        :param data: This is the stream received
                     from file adapters getData()
                     method
        :param fileType: We need to mention which type of file it is
                       i.e. csv/json.
        :raises Exception: When the facts cannot be added to the assessment.
        """

        datastream = self.falkonry.get_datastream(datastreamId)
        options = {
            "startTimeIdentifier": "start",
            "endTimeIdentifier": "end",
            "timeFormat": datastream.get_field().get_time().get_format(),
            "timeZone": datastream.get_field().get_time().get_zone(),
            "entityIdentifier": datastream.get_field().get_entityIdentifier(),
            # TODO: Change the name of the value identifier according to your data.
            "valueIdentifier": "value"
            # TODO: Uncomment this line if your facts data has any keyword identifier.
            # 'keywordIdentifier': 'Tag'
        }

        i = 0
        for i in range(0, 3):
            try:
                inputResponse = self.falkonry.add_facts(
                    assessmentId, fileType, options, data
                )
                status = self.checkDataIngestion(inputResponse)
                if status == "SUCCESS":
                    break
            except AddDataException:
                logging.warning("Adding facts failed! Retrying({})".format(i + 1))
        if i == 3:
            raise Exception("Cannot add facts to the assessment!")

    def ingestFactsDataFromFile(self, datastreamId, assessmentId, data, fileType):
        """
        This method adds facts to an existing assessment.

        :param datastreamId: The ID of an existing datastream.
        :param assessmentId: The ID of an existing assessment.
        :param data: This is the stream received
                     from file adapters getDataStream()
                     method
        :param fileType: We need to mention which type of file it is
                       i.e. csv/json.
        :raises Exception: When the facts cannot be added to the assessment.
        """

        datastream = self.falkonry.get_datastream(datastreamId)
        options = {
            "startTimeIdentifier": "time",
            "endTimeIdentifier": "end",
            "timeFormat": datastream.get_field().get_time().get_format(),
            "timeZone": datastream.get_field().get_time().get_zone(),
            "entityIdentifier": datastream.get_field().get_entityIdentifier(),
            # TODO: Change the name of the value identifier according to your data.
            "valueIdentifier": "value",
            # TODO: Uncomment this line if your facts data has any keyword identifier.
            # 'keywordIdentifier': 'Tag'
        }

        i = 0
        for i in range(0, 3):
            try:
                inputResponse = self.falkonry.add_facts_stream(
                    assessmentId, fileType, options, data
                )
                status = self.checkDataIngestion(inputResponse)
                if status == "SUCCESS":
                    break
            except AddDataException:
                logging.warning("Adding facts failed! Retrying({})".format(i + 1))
        if i == 3:
            raise Exception("Cannot add facts to the assessment!")

    def exportFacts(self, assessmentId, fileFormat):
        """
        This method exports the facts from a particular assessment to a file.

        :param fileFormat: The type of file format ie. csv/json.
        :param assessmentId: The ID of an existing assessment.
        """

        options = {format: fileFormat}
        response = self.falkonry.get_facts(assessmentId, options)
        file = open("testfile.txt", "w")
        r = response.text.replace('"', "")
        file.write(r)
        file.close()
        df = pd.read_csv("testfile.txt", delimiter=",")
        df.to_json("exportedFacts.json", orient="records", lines=True)
        os.remove("testfile.txt")
        logging.info("File sucessfully created")


if __name__ == "__main__":

    # File adapter will be used to get the appropriate data from the different files and to provide it
    # in the format in which we can send to the ADK methods.

    #################### For creating datastream and adding historical data ################
    """
    The below code will create a datastream and post the historical data as a string to the
    datastream. You will have to give the data as a string or give the fileName and pass it
    to the get_data() method of the file adapter.
    """

    fileAdapter = FileAdapter()
    fileName = "file name"
    data, fileType = fileAdapter.getData(fileName)

    adk_conn = ADKconn()
    datastreamId = adk_conn.createDataStream()
    adk_conn.ingestData(datastreamId, data, fileType)

    ########################################################################################

    ############### For creating datastream and adding historical data from a stream ################
    """
    The below code will create a datastream and post the historical data as a stream from
    the file to the datastream. You will have to give the fileName and pass it to the
    get_data_stream() method of the file adapter.
    """

    fileAdapter = FileAdapter()
    fileName = "file name"
    data, fileType = fileAdapter.getDataStream(fileName)

    adk_conn = ADKconn()
    datastreamId = adk_conn.createDataStream()
    adk_conn.ingestDataFromFile(datastreamId, data, fileType)

    ###############################################################################################

    ############## For creating datastream and adding data from a folder containing multiple files ################
    """
    The below code will create a datastream and post the historical data as a stream from
    the folder containing multiple files to the datastream. You will have to give the folder path and pass it to the
    postMoreHistoricalDataFromStream() in the adk connector
    """

    path = "folder path"

    adk_conn = ADKconn()
    datastreamId = adk_conn.createDataStream()
    adk_conn.ingestDataFromFolder(datastreamId, path)

    ##############################################################################################################

    #################### For adding facts data to an existing assessment. ################
    """
    The code below will add facts to an existing assessment in the form of a string.
    And for adding facts the model must be trained by the Falkonry UI.
    """

    fileAdapter = FileAdapter()
    fileName = "file name"
    data, fileType = fileAdapter.getData(fileName)

    adk_conn = ADKconn()
    datastreamId = "datastreamId"
    assessmentId = "assessmentid"
    adk_conn.ingestFactsData(datastreamId, assessmentId, data, fileType)

    ########################################################################################

    #################### For adding facts data from a stream to an existing assessment. ################
    """
    The code below will add facts to an existing assessment in the form of a stream.
    And for adding facts the model must be trained by the Falkonry UI.
    """

    fileAdapter = FileAdapter()
    fileName = "file name"
    data, fileType = fileAdapter.getDataStream(fileName)

    adk_conn = ADKconn()
    datastreamId = "datastreamId"
    assessmentId = "assessmentId"
    adk_conn.addFactsDataFromStream(datastreamId, assessmentId, data, fileType)

    ####################################################################################################

    #################### Exporting Facts data from a assessment to a file ################
    """
    The code below will export facts from an existing assessment to the file.
    """

    adk_conn = ADKconn()
    assessmentId = "assessmentId"
    fileFormat = "json"
    adk_conn.exportFacts(assessmentId, fileFormat)

    ####################################################################################################
