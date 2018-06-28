import os
import csv
import io
import pandas as pd
import time

class FileAdapter:

    def getData(self, fileName):
        try:
            os.path.isfile(fileName)
        except:
            raise FileNotFoundError("Please enter the correct path of the file")

        fileName, fileExtension = os.path.splitext(fileName)

        if fileExtension.lower() == ".csv" or fileExtension.lower() == ".json":
            with open(fileName + fileExtension) as f:
                stream = f.read()
            fileType = fileExtension.lower()[1:]
            return stream, fileType



    def getDataStream(self, fileName):
        try:
            os.path.isfile(fileName)
        except:
            raise FileNotFoundError("Please enter the correct path of the file")

        fileName, fileExtension = os.path.splitext(fileName)

        if fileExtension.lower() == '.csv' or fileExtension.lower() == '.json':
            stream = io.open(fileName + fileExtension)
            fileType = fileExtension.lower()[1:]
            return stream, fileType

