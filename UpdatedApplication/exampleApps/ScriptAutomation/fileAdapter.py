import os
import csv
import io
import pandas as pd
import time

class FileAdapter:

    def get_data(self, fileName):
        try:
            os.path.isfile(fileName)
        except:
            raise FileNotFoundError("Please enter the correct path of the file")

        fileName, fileExtension = os.path.splitext(fileName)

        if fileExtension.lower() == ".csv" or fileExtension.lower() == ".json":
            with open(self.file_name) as f:
                stream = f.read()
            fileType = fileExtension.lower()[1:]
            return stream, fileType



    def get_data_stream(self, fileName):
        try:
            os.path.isfile(fileName)
        except:
            raise FileNotFoundError("Please enter the correct path of the file")

        fileName, fileExtension = os.path.splitext(fileName)

        if fileExtension.lower() == '.csv' or fileExtension.lower() == '.json':
            stream = io.open('source0.csv')
            fileType = fileExtension.lower()[1:]
            return stream, fileType

