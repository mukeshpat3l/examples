using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using FalkonryClient;
using FalkonryClient.Helper.Models;
using Newtonsoft.Json;
using System.IO;
using log4net;

namespace examples
{
    class ADKConnnector
    {
        public static void Main(String[] args)
        {
            /*
                 USAGE:-
                 File adapter will be used to get the appropriate data from the different files and to provide it
                 in the format in which we can send to the ADK methods.

                *************** PLEASE NOTE ALL DATA FILES TO BE KEPT INSIDE THE 'ConsoleApp2/bin/debug/' FOLDER for relative path purposes.***************
             */

            /*
                #################### For creating datastream and adding data ################
                The below code will create a datastream and post the historical data as a string to the
                datastream. You will have to give the data as a string or give the fileName and pass it
                to the getData() method of the file adapter.
            */

            //FileAdapter f = new FileAdapter();
            //ADKConnHist aDK = new ADKConnHist();

            //var datastreamId = aDK.CreateDataStream();

            //String fileName = "fileName";
            //var stream = f.GetData(fileName);
            //String fileType = "csv";

            ////  TODO: Uncomment the following line for json file.
            //// fileType = "json";

            //aDK.IngestData(datastreamId, stream, fileType);

            //  ###############################################################################

            /*
                #################### For creating datastream and adding data from a stream  ################
                The below code will create a datastream and post the historical data as a stream from
                the file to the datastream. You will have to give the fileName and pass it to the
                getDataStream() method of the file adapter.
            */

            //FileAdapter f = new FileAdapter();
            //ADKConnHist aDK = new ADKConnHist();

            //var datastreamId = aDK.CreateDataStream();

            //String fileName = "fileName";
            //var stream = f.GetStream(fileName);
            //String fileType = "csv";

            ////  TODO: Uncomment the following line for json file.
            //// fileType = "json";

            //aDK.IngestDataFromFile(datastreamId, stream, fileType);


            //  #############################################################################################

            /*
                #################### For live data input and output  ################
                The below code will create a datastream and post the historical data as a stream from
                the file to the datastream. You will have to give the fileName and pass it to the
                getDataStream() method of the file adapter.
                NOTE:-
                 1. Go on the Falkonry UI and build a model.
                 2. After building a model, run the code.
                 While using this method you can choose between IngestData(), IngestDataFromFile() and IngestDataFromFolder()
                 and set live parameter as true.
            */

            //FileAdapter f = new FileAdapter();
            //ADKConnLive aDK = new ADKConnLive();

            //String datastreamId = "datastreamId";
            //String assessmentId = "assessmentId";

            //String fileName = "fileName";
            //var stream = f.GetStream(fileName);
            //String fileType = "csv";

            ////  TODO: Uncomment the following line for json file.
            //// fileType = "json";

            //Parallel.Invoke(() =>
            //{
            //    aDK.IngestDataFromFile(datastreamId, stream, fileType);
            //},
            //() =>
            //{
            //    aDK.GetLiveOutput(assessmentId);
            //});


            //  #########################################################################

            /*
                #################### Example For creating datastream and adding data from a folder containing multiple files   ################
  
                The below code will create a datastream and post the historical data as a stream from
                the folder containing multiple files to the datastream. You will have to give the folder path and pass it to the
                addMoreHistoricalDataFromStream() in the adk connector
            */
            //ADKConnHist aDK = new ADKConnHist();

            //String folderPath = "folderPath";
            //String datastreamId = aDK.CreateDataStream();
            //aDK.IngestDataFromFolder(datastreamId, folderPath);

            //  ########################################################################################################

            /*
                #################### For adding facts data to an existing assessment.  ################
                The code below will add facts to an existing assessment in the form of a string.
                And for adding facts the model must be trained by the Falkonry UI.
            */

            //ADKConnHist aDK = new ADKConnHist();
            //FileAdapter f = new FileAdapter();
            //String fileName = "fileName";
            //String fileType = "csv";
            //String datastreamId = "datastreamID";
            //String assessmentId = "assessmentID";

            ////  TODO: Uncomment the following line for json file.
            //// fileType = "json";

            //String stream = f.GetData(fileName);
            //aDK.IngestFactsData(datastreamId, assessmentId, stream, fileType);

            //  ########################################################################################################

            /*
                #################### For adding facts data from a stream to an existing assessment.################
                The code below will add facts to an existing assessment in the form of a stream.
                And for adding facts the model must be trained by the Merlin.
            */

            //ADKConnHist aDK = new ADKConnHist();
            //FileAdapter f = new FileAdapter();
            //String fileName = "fileName";
            //String fileType = "csv";
            //String datastreamId = "datastreamID";
            //String assessmentId = "assessmentID";

            ////  TODO: Uncomment the following line for json file.
            //// fileType = "json";

            //byte[] stream = f.GetStream(fileName);
            //aDK.IngestFactsFromFile(datastreamId, assessmentId, stream, fileType);

            //  ########################################################################################################

            /*
                #################### Exporting Facts ################
                This method will export the existing facts and then store them in a file named exportedFacts.json in the resources
                folder.
            */
            //ADKConnHist aDK = new ADKConnHist();
            //String assessmentId = "assessmentID";
            //String datastreamId = "datastreamID";
            //aDK.ExportFacts(datastreamId, assessmentId);

            //  ########################################################################################################

        }
    }
}
