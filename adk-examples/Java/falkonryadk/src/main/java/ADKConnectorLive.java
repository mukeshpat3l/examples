import com.falkonry.client.Falkonry;
import com.falkonry.helper.models.*;
import com.sun.xml.internal.fastinfoset.util.CharArray;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import java.lang.*;
import java.io.*;
import java.lang.reflect.Array;
import java.net.ConnectException;
import java.net.URL;
import java.util.*;
import org.apache.log4j.Logger;

import FileAdapter.FileAdapter;
import org.apache.log4j.PropertyConfigurator;

class ADKConn {
    String url = "https://example.falkonry.ai";
    String token = "YOUR_API_TOKEN";
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
     *  Adding historical data to an existing datastream.
     *  @param datastreamId The id of an existing datastream
     *                      or received from the
     *                      createDatastream method.
     *  @param stream This is the stream received
     *                from file adapters getData()
     *                method.
     *  @param fileType We need to mention which type of file it is
     *                 i.e. csv/json.
     *  @throws  Exception Will throw an exception if something is wrong
     *                     or missing.
     */
    public void ingestData(String datastreamId, String stream, String fileType) throws Exception {
        Datastream datastream = falkonry.getDatastream(datastreamId);

        Map<String, String> options = new HashMap<String, String>();
        options.put("timeIdentifier", datastream.getField().getTime().getIdentifier());
        options.put("timeFormat", datastream.getField().getTime().getFormat());
        options.put("timeZone", datastream.getField().getTime().getZone());
//      TODO: Uncomment these 2 lines out for Narrow Datastream Format.
//        options.put("signalIdentifier", "signal");
//        options.put("valueIdentifier",  "value");
//      TODO: Uncomment this line out for Batch window type.
//        options.put("batchIdentifier",  datastream.getField().getBatchIdentifier());
        options.put("entityIdentifier", datastream.getField().getEntityIdentifier());
        options.put("fileFormat", fileType);
//      NOTE: Streaming true since we are ingesting live data.
        options.put("streaming", "true");
        options.put("hasMoreData", "false");

        InputStatus inputStatus = falkonry.addInput(datastreamId, stream, options);

        log.info(inputStatus.getStatus());

    }

    /**
     *  Adding historical data stream to an existing datastream.
     *  @param datastreamId The id of an existing datastream
     *                      or received from the
     *                      createDatastream method.
     *  @param stream This is the stream received
     *                from file adapters getDataStream()
     *                method.
     *  @param fileType We need to mention which type of file it is
     *                  i.e. csv/json.
     *  @throws Exception Will throw an exception if something is wrong
     *                    or missing.
     */
    public void ingestDataFromFile(String datastreamId, ByteArrayInputStream stream, String fileType) throws Exception {

        Datastream datastream = falkonry.getDatastream(datastreamId);

        Map<String, String> options = new HashMap<String, String>();
        options.put("timeIdentifier", datastream.getField().getTime().getIdentifier());
        options.put("timeFormat", datastream.getField().getTime().getFormat());
        options.put("timeZone", datastream.getField().getTime().getZone());
//      TODO: Uncomment these 2 lines out for Narrow Datastream Format.
//        options.put("signalIdentifier", datastream.getField().getSignal().getSignalIdentifier());
//        options.put("valueIdentifier",  datastream.getField().getSignal().getValueIdentifier());
//      TODO: Uncomment this line out for Batch window type.
//        options.put("batchIdentifier",  datastream.getField().getBatchIdentifier());
        options.put("entityIdentifier", datastream.getField().getEntityIdentifier());
        options.put("fileFormat", fileType);
//      NOTE: Streaming true since we are ingesting live data.
        options.put("streaming", "true");
        options.put("hasMoreData", "false");


        InputStatus inputStatus = falkonry.addInputStream(datastreamId, stream, options);

        log.info(inputStatus.getStatus());

    }

    /**
     *  This method is just an example to show how our ADK manages
     *  multiple data files in a particular folder. It reads all
     *  the files and passes each one of them as a stream to an existing
     *  datastream.
     *  You can also use this method by calling it again and again for multiple folders by changing the path.
     *  @param datastreamId The id of an existing datastream
     *                      or received from the
     *                      createDatastream method.
     *  @param folderPath Complete folder path where the data files
     *                    are stored.
     *  @throws Exception Will throw an exception if something is wrong
     *                    or missing.
     */
    public void ingestDataFromFolder(String datastreamId, String folderPath) throws Exception {

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

            for (int i=0; i<files.size(); i++){
                FileAdapter f = new FileAdapter();
                ByteArrayInputStream stream = f.getDataStream(folderPath + "/" + files.get(i));
                String fileType = FilenameUtils.getExtension(folderPath + "/" + files.get(i));

                Map<String, String> options = new HashMap<String, String>();
                options.put("timeIdentifier", datastream.getField().getTime().getIdentifier());
                options.put("timeFormat", datastream.getField().getTime().getFormat());
                options.put("timeZone", datastream.getField().getTime().getZone());
//            TODO: Uncomment these 2 lines out for Narrow Datastream Format.
//            options.put("signalIdentifier", datastream.getField().getSignal().getSignalIdentifier());
//            options.put("valueIdentifier",  datastream.getField().getSignal().getValueIdentifier());
//            TODO: Uncomment this line out for Batch window type.
//            options.put("batchIdentifier",  datastream.getField().getBatchIdentifier());
                options.put("entityIdentifier", datastream.getField().getEntityIdentifier());
                options.put("fileFormat", fileType);
//              NOTE: Streaming true since we are ingesting live data.
                options.put("streaming", "true");
                log.info("Status for file: " + files.get(i));

                if(i == files.size() - 1){
                    options.put("hasMoreData", "false");
                } else {
                    options.put("hasMoreData", "true");
                }

                InputStatus inputStatus = falkonry.addInputStream(datastreamId, stream, options);

                log.info(inputStatus.getStatus());
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
     *  @throws Exception Will throw an exception if something is wrong
     *                    or missing.
     */
    public void getLiveOutput(String assessmentId) throws Exception {
        while(true){
            try {
                BufferedReader outputBuffer;
                outputBuffer = falkonry.getOutput(assessmentId);
                String contentLine = outputBuffer.readLine();
                while(contentLine != null){
                    log.info(contentLine);
                    contentLine = outputBuffer.readLine();
                }
                outputBuffer.close();
            } catch (ConnectException e){
                log.error(e);
            } catch (Exception e){
                log.error(e);
            }
        }

    }
}

public class ADKConnectorLive {

    static Logger log = Logger.getLogger(ADKConnectorLive.class);
    public static void main(String args[]) throws Exception {

//      Log4j Configuration code.
        PropertyConfigurator.configure(ADKConnectorLive.class.getResource("log4j.xml"));


/*
     USAGE:-

     File adapter will be used to get the appropriate data from the different files and to provide it
     in the format in which we can send to the ADK methods.

     *************** PLEASE NOTE ALL DATA FILES TO BE KEPT INSIDE THE 'resources' FOLDER which is inside the 'main' FOLDER.******************
*/

/*
    #################### For creating datastream and adding live data from a stream and getting live output ################


    The below code will create a datastream and post the historical data as a stream from
    the file to the datastream. You will have to give the fileName and pass it to the
    getDataStream() method of the file adapter.
    NOTE:-
     1. Go on the Falkonry UI and build a model.
     2. After building a model click LIVE(OFF) button to turn on the LIVE INPUT.
     While using this method you can choose between ingestData(), ingestDataFromFile() and ingestDataFromFolder()
     and set live parameter as true.
     3. CHANGE THIS AS PER YOUR WORKFLOW

*/

//    final ADKConn adk = new ADKConn();
//
//    FileAdapter f = new FileAdapter();
//    String fileName = "fileName";
//    final String fileType = FilenameUtils.getExtension(fileName);
//    URL url = ADKConnectorLive.class.getResource(fileName);
//
//    final ByteArrayInputStream stream = f.getDataStream(url.getPath());
//    final String datastreamId = "datastremId";
//    final String assessmentId = "assessmentId";
//
//    Thread thread1 = new Thread() {
//        public void run() {
//            try {
//                adk.ingestDataFromFile(datastreamId, stream, fileType);
//            } catch (Exception e) {
//                log.error(e);
//            }
//        }
//    };
//
//    Thread thread2 = new Thread() {
//        public void run() {
//            try {
//                adk.getLiveOutput(assessmentId);
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

// ########################################################################################################




    }

}
