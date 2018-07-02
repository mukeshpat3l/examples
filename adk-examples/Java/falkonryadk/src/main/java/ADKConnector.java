import com.falkonry.client.Falkonry;
import com.falkonry.helper.models.*;
import com.sun.xml.internal.fastinfoset.util.CharArray;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import java.lang.*;
import java.io.*;
import java.lang.reflect.Array;
import java.net.URL;
import java.util.*;
import org.apache.log4j.Logger;

import FileAdapter.FileAdapter;
import org.apache.log4j.PropertyConfigurator;

class ADKConn {
    String url = "";
    String token = "";
    Falkonry falkonry =  new Falkonry(url, token);
    Datastream ds =  new Datastream();
    Datasource datasource = new Datasource();
    Field field = new Field();
    TimeObject time = new TimeObject();
    Signal signal = new Signal();
    String datastreamId;

    ADKConn() throws Exception {
    }

    /**
     *  log4j Configuration.
     */
    static Logger log = Logger.getLogger(ADKConn.class);

    /**
     *  Creates a new datastream on the Falkonry UI.
     *  @return Datastream ID.
     */
    public String createDataStream() throws Exception {

        String dataStreamName = "TESTING";
        ds.setName(dataStreamName);

        String timezone = "GMT";
        time.setZone(timezone);

        String timeIdentifier = "time";
        time.setIdentifier(timeIdentifier);

        String timeFormat = "millis";
        time.setFormat(timeFormat);

        String precisionFormat = "millis";
        ds.setTimePrecision(precisionFormat);

        field.setTime(time);
        field.setSignal(signal);
        datasource.setType("STANDALONE");
        ds.setDatasource(datasource);
        ds.setField(field);

        String entityIdentifier = "entity";
        field.setEntityIdentifier(entityIdentifier);


//      ###  USE THIS IF YOUR DATA IS IN NARROW FORMAT  ###

//      String signalIdentifier = "signal";
//      signal.setSignalIdentifier(signalIdentifier);
//      String valueIdentifier = "value";
//      signal.setValueIdentifier(valueIdentifier);


//      ### USE THIS IF YOU HAVE BATCH DATA ###
//      String batchIdentifier = "batch_id";
//      field.setBatchIdentifier(batchIdentifier);


        Datastream createdDataStream = falkonry.createDatastream(ds);
        String datastreamId = createdDataStream.getId();

        return datastreamId;
    }

    /**
     *  Adding historical data to an existing datastream.
     *  @param datastreamId The id of an existing datastream
     *                      or received from the
     *                      createDatastream method.
     *  @param stream This is the stream received
     *                from file adapters getData()
     *                method.
     *  @param live  If you want to post live data
     *               then keep this parameter true.
     */
    public void postData(String datastreamId, String stream, Boolean live) throws Exception {
        Datastream datastream = falkonry.getDatastream(datastreamId);

        Map<String, String> options = new HashMap<String, String>();
        options.put("timeIdentifier", datastream.getField().getTime().getIdentifier());
        options.put("timeFormat", datastream.getField().getTime().getFormat());
        options.put("timeZone", datastream.getField().getTime().getZone());
//        options.put("signalIdentifier", "signal");
//        options.put("valueIdentifier",  "value");
//        options.put("batchIdentifier",  datastream.getField().getBatchIdentifier());
        options.put("entityIdentifier", datastream.getField().getEntityIdentifier());
        options.put("fileFormat", "json");
        options.put("streaming", live.toString());
        options.put("hasMoreData", "false");

        if(!live){
            int i;
            for(i=0; i<3; i++){
                try {
                    InputStatus inputStatus = falkonry.addInput(datastreamId, stream, options);
                    String status = checkStatus(inputStatus.getId());
                    if(status == "SUCCESS"){
                        log.info("DATA ADDED SUCCESSFULLY");
                        break;
                    } else {
                        throw new Exception("Adding data failed! Retry " + (i+1) + ".");
                    }
                } catch (Exception e){
                    log.warn(e);
                }
            }
            if(i==3){
                log.error("Cannot add data to the datastream!");
                System.exit(0);
            }

        }  else {
            InputStatus inputStatus = falkonry.addInput(datastreamId, stream, options);
        }

    }

    /**
     *  Adding historical data stream to an existing datastream.
     *  @param datastreamId The id of an existing datastream
     *                      or received from the
     *                      createDatastream method.
     *  @param stream This is the stream received
     *                from file adapters getDataStream()
     *                method.
     *  @param live  If you want to post live data
     *               then keep this parameter true.
     */
    public void postDataFromStream(String datastreamId, ByteArrayInputStream stream, Boolean live) throws Exception {

        Datastream datastream = falkonry.getDatastream(datastreamId);

        Map<String, String> options = new HashMap<String, String>();
        options.put("timeIdentifier", datastream.getField().getTime().getIdentifier());
        options.put("timeFormat", datastream.getField().getTime().getFormat());
        options.put("timeZone", datastream.getField().getTime().getZone());
//        options.put("signalIdentifier", datastream.getField().getSignal().getSignalIdentifier());
//        options.put("valueIdentifier",  datastream.getField().getSignal().getValueIdentifier());
//        options.put("batchIdentifier",  datastream.getField().getBatchIdentifier());
        options.put("entityIdentifier", datastream.getField().getEntityIdentifier());
        options.put("streaming", live.toString());
        options.put("hasMoreData", "false");

        if(!live){
            int i;
            for(i=0; i<3; i++){
                try {
                    InputStatus inputStatus = falkonry.addInputStream(datastreamId, stream, options);
                    String status = checkStatus(inputStatus.getId());
                    if(status == "SUCCESS"){
                        log.info("DATA ADDED SUCCESSFULLY");
                        break;
                    } else {
                        throw new Exception("Adding data failed! Retry " + (i+1) + ".");
                    }
                } catch (Exception e){
                    log.warn(e);
                }
            }
            if(i==3){
                log.error("Cannot add data to the datastream!");
                System.exit(0);
            }

        }  else {
            InputStatus inputStatus = falkonry.addInputStream(datastreamId, stream, options);
        }
    }

    /**
     *  This method is just an example to show how our ADK manages
     *  multiple data files in a particular folder. It reads all
     *  the files and passes each one of them as a stream to an existing
     *  datastream.
     *  @param datastreamId The id of an existing datastream
     *                      or received from the
     *                      createDatastream method.
     *  @param folderPath Complete folder path where the data files
     *                    are stored.
     *  @param live  If you want to post live data
     *               then keep this parameter true.
     */
    public void postMoreDataFromStream(String datastreamId, String folderPath, Boolean live) throws Exception {

        Datastream datastream = falkonry.getDatastream(datastreamId);


        File folder = new File(folderPath);
        File[] listOfFiles = folder.listFiles();
        ArrayList<String> files = new ArrayList<String>();

        for (int i = 0; i < listOfFiles.length; i++) {
            String f = FilenameUtils.getExtension(listOfFiles[i].getName());
            if (listOfFiles[i].isFile() && (f.equals("csv") || f.equals("json") )) {
                files.add(listOfFiles[i].getName());
            }
        }
        if(files.size() != 0) {
            FileAdapter f = new FileAdapter();

            Map<String, String> options = new HashMap<String, String>();
            options.put("timeIdentifier", datastream.getField().getTime().getIdentifier());
            options.put("timeFormat", datastream.getField().getTime().getFormat());
            options.put("timeZone", datastream.getField().getTime().getZone());
//            options.put("signalIdentifier", datastream.getField().getSignal().getSignalIdentifier());
//            options.put("valueIdentifier",  datastream.getField().getSignal().getValueIdentifier());
//            options.put("batchIdentifier",  datastream.getField().getBatchIdentifier());
            options.put("entityIdentifier", datastream.getField().getEntityIdentifier());
            options.put("streaming", live.toString());
            options.put("hasMoreData", "true");
            for (int i=0; i<files.size(); i++){
                ByteArrayInputStream stream = f.getDataStream(folderPath + "/" + files.get(i));
                log.info("Status for file: " + files.get(i));
                if(!live){
                    int j;
                    for(j=0; j<3; j++){
                        try {
                            InputStatus inputStatus = falkonry.addInputStream(datastreamId, stream, options);
                            String status = checkStatus(inputStatus.getId());
                            if(status == "SUCCESS"){
                                log.info("DATA ADDED SUCCESSFULLY");
                                break;
                            } else {
                                throw new Exception("Adding data failed! Retry " + (j+1) + ".");
                            }
                        } catch (Exception e){
                            log.warn(e);
                        }
                    }
                    if(j==3){
                        log.error("Cannot add data to the datastream!");
                        System.exit(0);
                    }

                }  else {
                    InputStatus inputStatus = falkonry.addInputStream(datastreamId, stream, options);
                }
            }
        }
    }

    /**
     *  This method is used get the streaming output or live data
     *  output which is only visible if there is a live datastream
     *  on or by calling our postRealTimeData method and this method
     *  can only be used if you have trained a model on Falkonry UI
     *  and then turned ON LIVE button on Falkonry UI.
     *  @param assessmentId This ID you can find in the Assesment tab
     *                      after you have trained a model.
     */
    public void getLiveOutput(String assessmentId) throws Exception {
        BufferedReader outputBuffer;
        outputBuffer = falkonry.getOutput(assessmentId);
        String contentLine = outputBuffer.readLine();
        while(contentLine != null){
            log.info(contentLine);
            contentLine = outputBuffer.readLine();
        }
        outputBuffer.close();
    }

    private String checkStatus(String trackerId) throws Exception {
        for(int i=0; i < 12; i++) {
            Tracker tracker = falkonry.getStatus(trackerId);

           if(tracker.getStatus().equals("SUCCESS") || tracker.getStatus().equals("COMPLETED")){
                return "SUCCESS";
            }
            Thread.sleep(5000);
        }
        return null;
    }


}

public class ADKConnector {

    static Logger log = Logger.getLogger(ADKConnector.class);
    public static void main(String args[]) throws Exception {

//      Log4j Configuration code.
        PropertyConfigurator.configure(ADKConnector.class.getResource("log4j.xml"));


/*
     USAGE:-

     File adapter will be used to get the appropriate data from the different files and to provide it
     in the format in which we can send to the ADK methods.

     *************** PLEASE NOTE ALL DATA FILES TO BE KEPT INSIDE THE 'resources' FOLDER which is inside the 'main' FOLDER.******************
*/

/*

    #################### For creating datastream and adding historical data ################

    The below code will create a datastream and post the historical data as a string to the
    datastream. You will have to give the data as a string or give the fileName and pass it
    to the getData() method of the file adapter.

*/

//    final ADKConn adk = new ADKConn();
//
//    FileAdapter f = new FileAdapter();
//    String fileName = "fileName";
//
//    URL url = ADKConnector.class.getResource(fileName);
//    String stream = f.getData(url.getPath());
//    String datastreamId = adk.createDataStream();
//    Boolean liveStatus = false;
//    adk.postData(datastreamId, stream, liveStatus);

//  ##################################################################################################

/*
    #################### For creating datastream and adding historical data from a stream  ################


    The below code will create a datastream and post the historical data as a stream from
    the file to the datastream. You will have to give the fileName and pass it to the
    getDataStream() method of the file adapter.

*/
//
//    final ADKConn adk = new ADKConn();
//
//    FileAdapter f = new FileAdapter();
//    String fileName = "fileName";
//
//    URL url = ADKConnector.class.getResource(fileName);
//
//    ByteArrayInputStream stream = f.getDataStream(url.getPath());
//    String datastreamId = adk.createDataStream();
//    Boolean liveStatus = false;
//    adk.postDataFromStream(datastreamId, stream, liveStatus);

// ########################################################################################################


/*
    #################### For live data input and output  ################


    The below code will create a datastream and post the historical data as a stream from
    the file to the datastream. You will have to give the fileName and pass it to the
    getDataStream() method of the file adapter.

    NOTE:-
     1. Go on the Falkonry UI and build a model.
     2. After building a model click LIVE(OFF) button to turn on the LIVE INPUT.
     While using this method you can choose between postData(), postDataFromStream() and postMoreDataFromStream()
     and set live parameter as true.
*/

//    final ADKConn adk = new ADKConn();
//
//    FileAdapter f = new FileAdapter();
//
//    String fileName = "fileName";
//    URL url = ADKConnector.class.getResource(fileName);
//    final Boolean liveStatus = true;
//    final ByteArrayInputStream stream = f.getDataStream(url.getPath());
//
//    Thread thread1 = new Thread() {
//        public void run() {
//            try {
//                adk.postDataFromStream("datastream_id", stream, liveStatus);
//            } catch (Exception e) {
//                log.error(e);
//            }
//        }
//    };
//
//    Thread thread2 = new Thread() {
//        public void run() {
//            try {
//                adk.getLiveOutput("assessment_id");
//
//            } catch (Exception e) {
//                log.error(e);
//            }
//        }
//    };
//
//    thread1.start();
//    thread2.start();
//
//    thread1.join();
//    thread2.join();
// #########################################################################

/*
    #################### Example For creating datastream and adding data from a folder containing multiple files   ################


    The below code will create a datastream and post the historical data as a stream from
    the folder containing multiple files to the datastream. You will have to give the folder path and pass it to the
    addMoreHistoricalDataFromStream() in the adk connector

*/

//    final ADKConn adk = new ADKConn();
//    Boolean liveStatus = false;
//    String folderPath= "../path/../demo-data/";
//    adk.postMoreDataFromStream("datastream_id", folderPath, liveStatus);

// ########################################################################################################
    }

}
