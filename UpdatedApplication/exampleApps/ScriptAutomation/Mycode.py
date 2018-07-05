import pandas as pd
import io
import os
for i in range(2):
	fileName, fileExtension = os.path.splitext("Source.csv")
	stream = io.open(fileName + str(i) + fileExtension)
	#inputResponse = self.falkonry.add_input_stream(datastream_id, fileType, options, stream)
	df = pd.read_csv(fileName + str(i) + fileExtension)
	time_colm = df.loc[:, "time"]
	prev_time = df.loc[len(df) - 1, "time"]
	time_difference = df.loc[1, "time"] - df.loc[0, "time"]
	for j in range(len(time_colm)):
		if j == 0:
			df.loc[j, "time"] = prev_time + time_difference
		else:
			df.loc[j, "time"] = df.loc[j - 1, "time"] + time_difference
		df = df.loc[:, ]
		df.to_csv(fileName + str(i + 1) + fileExtension, index=False)
