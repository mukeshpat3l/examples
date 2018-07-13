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

class ADKConnHist {
    String url = "https://example.falkonry.ai";
    String token = "YOUR_API_TOKEN";
    Falkonry falkonry =  new Falkonry(url, token);
    Datastream ds =  new Datastream();
    Datasource datasource = new Datasource();
    Field field = new Field();
    TimeObject time = new TimeObject();
    Signal signal = new Signal();
    String datastreamId;

    ADKConnHist() throws Exception {
    }

    /**
     *  log4j Configuration.
     */
    static Logger log = Logger.getLogger(ADKConnHist.class);

    /**
     *  Creates a new datastream on the Falkonry UI.
     *  @return Datastream ID.
     *  @throws Exception Will throw an exception if something is wrong
     *                    or missing.
     */
    public String createDataStream() throws Exception {

        String dataStreamName = "DATASTREAM_NAME";
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
//      TODO: Uncomment these 2 lines out for Narrow Datastream Format.
//      String signalIdentifier = "signal";
//      signal.setSignalIdentifier(signalIdentifier);
//      String valueIdentifier = "value";
//      signal.setValueIdentifier(valueIdentifier);


//      ### USE THIS IF YOU HAVE BATCH DATA ###
//      TODO: Uncomment this line out for Batch window type.
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
     *  @param fileType  We need to mention which type of file it is
     *                   i.e. csv/json.
     *  @throws Exception Will throw an exception if something is wrong
     *                    or missing.
     */
    public void ingestData(String datastreamId, String stream, String fileType) throws Exception {
        Datastream datastream = falkonry.getDatastream(datastreamId);

        Map<String, String> options = new HashMap<String, String>();
        options.put("timeIdentifier", datastream.getField().getTime().getIdentifier());
        options.put("timeFormat", datastream.getField().getTime().getFormat());
        options.put("timeZone", datastream.getField().getTime().getZone());
//       TODO: Uncomment these 2 lines out for Narrow Datastream Format.
//        options.put("signalIdentifier", "signal");
//        options.put("valueIdentifier",  "value");
//       TODO: Uncomment this line out for Batch window type.
//        options.put("batchIdentifier",  datastream.getField().getBatchIdentifier());
        options.put("entityIdentifier", datastream.getField().getEntityIdentifier());
        options.put("fileFormat", fileType);
        options.put("streaming", "false");
        options.put("hasMoreData", "false");


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
    }

    /**
     *  Adding historical data stream to an existing datastream.
     *  @param datastreamId The id of an existing datastream
     *                      or received from the
     *                      createDatastream method.
     *  @param stream This is the stream received
     *                from file adapters getDataStream()
     *                method.
     *  @param fileType  We need to mention which type of file it is
     *                   i.e. csv/json.
     *  @throws Exception Will throw an exception if something is wrong
     *                    or missing.
     */
    public void ingestDatafromFile(String datastreamId, ByteArrayInputStream stream, String fileType) throws Exception {

        Datastream datastream = falkonry.getDatastream(datastreamId);

        Map<String, String> options = new HashMap<String, String>();
        options.put("timeIdentifier", datastream.getField().getTime().getIdentifier());
        options.put("timeFormat", datastream.getField().getTime().getFormat());
        options.put("timeZone", datastream.getField().getTime().getZone());
//        TODO: Uncomment these 2 lines out for Narrow Datastream Format.
//        options.put("signalIdentifier", datastream.getField().getSignal().getSignalIdentifier());
//        options.put("valueIdentifier",  datastream.getField().getSignal().getValueIdentifier());
//        TODO: Uncomment this line out for Batch window type.
//        options.put("batchIdentifier",  datastream.getField().getBatchIdentifier());
        options.put("entityIdentifier", datastream.getField().getEntityIdentifier());
        options.put("fileFormat", fileType);
        options.put("streaming", "false");
        options.put("hasMoreData", "false");

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
                options.put("streaming", "false");

                log.info("Status for file: " + files.get(i));

                if(i == files.size() - 1){
                    options.put("hasMoreData", "false");
                } else {
                    options.put("hasMoreData", "true");
                }

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
            }
        }
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

    /**
     * This method adds facts to an existing data stream.
     * @param datastreamId The ID of an existing data stream.
     * @param assessmentId The ID of an existing assessment.
     * @param stream This is the stream received
     *               from file adapters getData()
     *               method
     * @param fileType We need to mention which type of file it is
     *                 i.e. csv/json.
     * @throws Exception Will throw an exception if something is wrong
     *                   or missing.
     */
    public void ingestFactsData(String datastreamId, String assessmentId, String stream, String fileType) throws Exception {
        Datastream datastream = falkonry.getDatastream(datastreamId);

        Map<String, String> options = new HashMap<String, String>();
        options.put("startTimeIdentifier", "start");
        options.put("endTimeIdentifier", "end");
        options.put("timeFormat", datastream.getField().getTime().getFormat());
        options.put("timeZone", datastream.getField().getTime().getZone());
        options.put("entityIdentifier",  datastream.getField().getEntityIdentifier());
//     TODO: Change the name of the value identifier according to your data.
        options.put("valueIdentifier", "value");
//     TODO: Uncomment this line if your facts data has any keyword identifier.
//        options.put("keywordIdentifier", "Tag");

        int j;
        for(j=0; j<3; j++){
            try {
                InputStatus inputStatus = falkonry.addFacts(assessmentId, stream, options);
                String status = checkStatus(inputStatus.getId());
                if(status == "SUCCESS"){
                    log.info("FACTS ADDED SUCCESSFULLY");
                    break;
                } else {
                    throw new Exception("Adding facts failed! Retry " + (j+1) + ".");
                }
            } catch (Exception e){
                log.warn(e);
            }
        }
        if(j==3){
            log.error("Cannot add facts to the datastream!");
            System.exit(0);
        }
    }

    /**
     * This method adds facts to an existing data stream.
     * @param datastreamId The ID of an existing data stream.
     * @param assessmentId The ID of an existing assessment.
     * @param stream This is the stream received
     *               from file adapters getDataStream()
     *               method
     * @param fileType We need to mention which type of file it is
     *                 i.e. csv/json.
     * @throws Exception Will throw an exception if something is wrong
     *                   or missing.
     */
    public void ingestFactsFromFile(String datastreamId, String assessmentId, ByteArrayInputStream stream, String fileType) throws Exception {
        Datastream datastream = falkonry.getDatastream(datastreamId);

        Map<String, String> options = new HashMap<String, String>();
        options.put("startTimeIdentifier", "start");
        options.put("endTimeIdentifier", "end");
        options.put("timeFormat", datastream.getField().getTime().getFormat());
        options.put("timeZone", datastream.getField().getTime().getZone());
        options.put("entityIdentifier",  datastream.getField().getEntityIdentifier());
//     TODO: Change the name of the value identifier according to your data.
        options.put("valueIdentifier", "value");
//     TODO: Uncomment this line if your facts data has any keyword identifier.
//        options.put("keywordIdentifier", "Tag");

        int j;
        for(j=0; j<3; j++){
            try {
                InputStatus inputStatus = falkonry.addFactsStream(assessmentId, stream, options);
                String status = checkStatus(inputStatus.getId());
                if(status == "SUCCESS"){
                    log.info("FACTS ADDED SUCCESSFULLY");
                    break;
                } else {
                    throw new Exception("Adding facts failed! Retry " + (j+1) + ".");
                }
            } catch (Exception e){
                log.warn(e);
            }
        }
        if(j==3){
            log.error("Cannot add facts to the datastream!");
            System.exit(0);
        }
    }

    /**
     *
     * @param datastreamId The ID of an existing data stream.
     * @param assessmentId The ID of an existing assessment.
     * @throws Exception  Will throw an exception if something is wrong
     *                    or missing.
     */
    public void exportFacts(String datastreamId, String assessmentId) throws Exception {
        Map<String, String> options = new HashMap<String, String>();
        options.put("format", "json");
        log.info("Exporting Facts Data");
        HttpResponseFormat exportedFacts = falkonry.getFactsData(assessmentId, options);
        log.info(exportedFacts.getResponse());
        PrintWriter writer = new PrintWriter("src/main/resources/exportedFatcs.json", "UTF-8");
        writer.println(exportedFacts.getResponse());
        writer.close();
    }


}

public class ADKConnectorHist {

    static Logger log = Logger.getLogger(ADKConnectorHist.class);
    public static void main(String args[]) throws Exception {

//      Log4j Configuration code.
        PropertyConfigurator.configure(ADKConnectorHist.class.getResource("log4j.xml"));


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

//        final ADKConnHist adk = new ADKConnHist();
//
//        FileAdapter f = new FileAdapter();
//        String fileName = "fileName";
//        String fileType = FilenameUtils.getExtension(fileName);
//        URL url = ADKConnectorHist.class.getResource(fileName);
//        String stream = f.getData(url.getPath());
//
//        String datastreamId = adk.createDataStream();
//        adk.ingestData(datastreamId, stream, fileType);

//  ##################################################################################################

/*
    #################### For creating datastream and adding historical data from a stream  ################


    The below code will create a datastream and post the historical data as a stream from
    the file to the datastream. You will have to give the fileName and pass it to the
    getDataStream() method of the file adapter.

*/

//    final ADKConnHist adk = new ADKConnHist();
//
//    FileAdapter f = new FileAdapter();
//    String fileName = "fileName";
//    String fileType = FilenameUtils.getExtension(fileName);
//    URL url = ADKConnectorHist.class.getResource(fileName);
//
//    ByteArrayInputStream stream = f.getDataStream(url.getPath());
//    String datastreamId = adk.createDataStream();
//    adk.ingestDatafromFile(datastreamId, stream, fileType);

// ########################################################################################################

/*
    #################### Example For creating datastream and adding data from a folder containing multiple files.   ################


    The below code will create a datastream and post the historical data as a stream from
    the folder containing multiple files to the datastream. You will have to give the folder path and pass it to the
    addMoreHistoricalDataFromStream() in the adk connector

*/
//
//    final ADKConnHist adk = new ADKConnHist();
//
//    String folderPath= "../path/../demo-data/";
//    adk.ingestDataFromFolder("datastream_id", folderPath);

// ########################################################################################################

/*
    #################### For adding facts data to an existing assessment.  ################
    The code below will add facts to an existing assessment in the form of a string.
    And for adding facts the model must be trained by the Falkonry UI.

*/

//    final ADKConnHist adk = new ADKConnHist();
//    FileAdapter f = new FileAdapter();
//    String fileName = "simple_batch_numerical_multiple_entity_facts.csv";
//    URL url = ADKConnectorLive.class.getResource(fileName);
//
//    final String fileType = FilenameUtils.getExtension(fileName);
//    final String stream = f.getData(url.getPath());
//
//    adk.ingestFactsData("datastreamId", "assessmentId", stream, fileType);

// ########################################################################################################

/*
    #################### For adding facts data from a to an existing assessment.################
    The code below will add facts to an existing assessment in the form of a stream.
    And for adding facts the model must be trained by the Falkonry UI.

*/

//    final ADKConnHist adk = new ADKConnHist();
//    FileAdapter f = new FileAdapter();
//    String fileName = "fileName";
//    URL url = ADKConnectorLive.class.getResource(fileName);
//
//    final String fileType = FilenameUtils.getExtension(fileName);
//    final ByteArrayInputStream stream = f.getDataStream(url.getPath());
//
//    adk.ingestFactsFromFile("datastream_id", "assessment_id", stream, fileType);

// ########################################################################################################

/*
    #################### Exporting Facts ################
    This method will export the existing facts and then store them in a file named exportedFacts.json in the resources
    folder.

*/

//    final ADKConnHist adk = new ADKConnHist();
//
//    adk.exportFacts("datastream_id", "assessment_id");

// ########################################################################################################
    }

}
