import os
import io

class FileAdapter:

    def getData(self, fileName):
        try:
            os.path.isfile(fileName)
        except:
            raise FileNotFoundError("Please enter the correct path of the file")

        fileName, fileExtension = os.path.splitext(fileName)

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

        stream = io.open(fileName + fileExtension)
        fileType = fileExtension.lower()[1:]
        return stream, fileType

