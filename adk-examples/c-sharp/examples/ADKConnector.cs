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

namespace ConsoleApp2
{
    class ADKConnnector
    {
        static String url = "https://example.falkonry.ai";
        static String token = "token";
        Falkonry falkonry = new Falkonry(url, token);
        DatastreamRequest ds = new DatastreamRequest();
        Datasource dataSource = new Datasource();
        Field field = new Field();
        Time time = new Time();
        Signal signal = new Signal();

        private int CheckStatus(System.String trackerId)
        {
            for (int i = 0; i < 12; i++)
            {
                Tracker tracker = falkonry.GetStatus(trackerId);
                if (tracker.Status.Equals("FAILED") || tracker.Status.Equals("ERROR"))
                {
                    throw new System.Exception(tracker.Message + "\n");
                }
                else if (tracker.Status.Equals("SUCCESS") || tracker.Status.Equals("COMPLETED"))
                {
                    Console.Write(tracker.Status + "\n");
                    return 1;
                }
                System.Threading.Thread.Sleep(5000);
            }
            return 0;
        }

        public String CreateDataStream()
        {
            String datastreamName = "C#_TEST_4";
            String timeZone = "GMT";
            String timeIdentifier = "time";
            String timeFormat = "millis";
            String PrecisionFormat = "millis";
            String entityIdentifier = "entity";
            //String signalIdentifier = "signal";     //for narrow data format
            //String valueIdentifier = "value";       //for narrow data format
            //String batchIdentifier = "batch_id";       //for batch-type data

            time.Format = timeFormat;
            time.Zone = timeZone;
            time.Identifier = timeIdentifier;
            ds.TimePrecision = PrecisionFormat;
            dataSource.Type = "PI";
            ds.DataSource = dataSource;
            ds.Name = datastreamName;
            ds.Field = field;
            ds.Field.Time = time;
            ds.Field.Signal = signal;
            ds.Field.EntityIdentifier = entityIdentifier;
            //ds.Field.Signal.SignalIdentifier = signalIdentifier;        //for narrow data format
            //ds.Field.Signal.ValueIdentifier = valueIdentifier;          //for narrow data format
            //ds.Field.BatchIdentifier = batchIdentifier;                 //for batch-type data
            Datastream datastream = falkonry.CreateDatastream(ds);
            Console.Write("New Datastream with id {0} created. \n", datastream.Id);
            return datastream.Id;
        }

        public void PostData(String datastreamId, String stream, String fileType, Boolean liveStatus=false)
        {
            if (fileType == null || datastreamId == null || stream == null)
            {
                throw new ArgumentNullException(nameof(fileType));
            }
            Datastream datastream = falkonry.GetDatastream(datastreamId);
            var options = new SortedDictionary<string, string>();
            var inputStatus = new InputStatus();
            options.Add("streaming", liveStatus.ToString());
            options.Add("hasMoreData", "false");
            options.Add("timeIdentifier", datastream.Field.Time.Identifier.ToString());
            options.Add("timeZone", datastream.Field.Time.Zone.ToString());
            options.Add("timeFormat", datastream.Field.Time.Format.ToString());
            options.Add("entityIdentifier", datastream.Field.EntityIdentifier.ToString());
            //options.Add("signalIdentifier", datastream.Field.Signal.SignalIdentifier.ToString());     // for narrow data format
            //options.Add("valueIdentifier", datastream.Field.Signal.ValueIdentifier.ToString());       // for narrow data format
            //options.Add("batchIdentifier", datastream.Field.BatchIdentifier.ToString());              // for batch-type data
            options.Add("fileFormat", fileType);
            if (!liveStatus)
            {
                int i;
                for (i = 0; i < 3; i++)
                {
                    try
                    {
                        inputStatus = falkonry.AddInput(datastreamId, stream, options);
                        if (CheckStatus(inputStatus.Id) == 1)
                        {
                            break;
                        }
                    }
                    catch (FalkonryClient.Service.FalkonryException e)
                    {
                        log.Error(e.GetBaseException() + "\n");
                        Console.ReadKey();
                        Environment.Exit(1);
                    }
                    catch (Exception ex)
                    {
                       log.WarnFormat(ex.Message + "\n" + "Retry Attempt: {0}", i + 1);
                    }
                }
                if (i == 3)
                {
                    log.Error("Cannot add data to the datastream!");
                    Console.ReadKey();
                    Environment.Exit(1);
                }
            }
            else
            {
                try
                {
                    inputStatus = falkonry.AddInput(datastreamId, stream, options);
                }
                catch (FalkonryClient.Service.FalkonryException e)
                {
                    log.Error(e.GetBaseException() + "\n");
                }
            }
        }

        public void PostDataFromStream(String datastreamId, byte[] stream, String fileType, Boolean liveStatus = false)
        {
            if (fileType == null || datastreamId == null || stream == null)
            {
                throw new ArgumentNullException(nameof(fileType));
            }
            Datastream datastream = falkonry.GetDatastream(datastreamId);
            var inputStatus = new InputStatus();
            var options = new SortedDictionary<string, string>();
            options.Add("streaming", liveStatus.ToString());
            options.Add("hasMoreData", "false");
            options.Add("timeIdentifier", datastream.Field.Time.Identifier.ToString());
            options.Add("timeZone", datastream.Field.Time.Zone.ToString());
            options.Add("timeFormat", datastream.Field.Time.Format.ToString());
            options.Add("entityIdentifier", datastream.Field.EntityIdentifier.ToString());
            //options.Add("signalIdentifier", datastream.Field.Signal.SignalIdentifier.ToString());     // for narrow data format
            //options.Add("valueIdentifier", datastream.Field.Signal.ValueIdentifier.ToString());       // for narrow data format
            //options.Add("batchIdentifier", datastream.Field.BatchIdentifier.ToString());              // for batch-type data
            options.Add("fileFormat", fileType);
            if (!liveStatus)
            {
                int i;
                for (i = 0; i < 3; i++)
                {
                    try
                    {
                        inputStatus = falkonry.AddInputStream(datastreamId, stream, options);
                        if (CheckStatus(inputStatus.Id) == 1)
                        {
                            break;
                        }
                    }
                    catch (FalkonryClient.Service.FalkonryException e)
                    {
                        log.Error(e.GetBaseException() + "\n");
                        Console.ReadKey();
                        Environment.Exit(1);
                    }
                    catch (Exception ex)
                    {
                        log.WarnFormat(ex.Message + "\n" + "Retry Attempt: {0}", i + 1);
                    }
                }
                if(i == 3)
                {
                    log.Error("Cannot add data to the datastream!");
                    Console.ReadKey();
                    Environment.Exit(1);
                }
            }
            else
            {
                try
                {
                    inputStatus = falkonry.AddInputStream(datastreamId, stream, options);
                }
                catch (FalkonryClient.Service.FalkonryException e)
                {
                    Console.Write(e.GetBaseException() + "\n");
                }
            }
        }


        public void PostMoreDataFromStream(String datastreamId, String folderPath, Boolean liveStatus = false)
        {
            if (datastreamId == null || folderPath == null)
            {
                throw new ArgumentNullException(nameof(datastreamId));
            }
            FileAdapter fileAdapter = new FileAdapter();
            Datastream datastream = falkonry.GetDatastream(datastreamId);
            var options = new SortedDictionary<string, string>();
            options.Add("streaming", liveStatus.ToString());
            options.Add("hasMoreData", "true");
            options.Add("timeIdentifier", datastream.Field.Time.Identifier.ToString());
            options.Add("timeZone", datastream.Field.Time.Zone.ToString());
            options.Add("timeFormat", datastream.Field.Time.Format.ToString());
            options.Add("entityIdentifier", datastream.Field.EntityIdentifier.ToString());
            //options.Add("signalIdentifier", datastream.Field.Signal.SignalIdentifier.ToString());     // for narrow data format
            //options.Add("valueIdentifier", datastream.Field.Signal.ValueIdentifier.ToString());       // for narrow data format
            //options.Add("batchIdentifier", datastream.Field.BatchIdentifier.ToString());              // for batch-type data
            options.Add("fileFormat", "csv");
            var inputStatus = new InputStatus();
            String[] Files = Directory.GetFiles(folderPath + "\\", "*.csv");
            var fileCount = Files.Length;
            foreach(String file in Files)
            {
                byte[] stream = fileAdapter.GetStream(file);
                if(fileCount == 1)
                {
                    options["hasMoreData"] = "false";
                }
                fileCount--;
                if (!liveStatus)
                {
                    int i;
                    for (i = 0; i < 3; i++)
                    {
                        try
                        {
                            inputStatus = falkonry.AddInputStream(datastreamId, stream, options);
                            if (CheckStatus(inputStatus.Id) == 1)
                            {
                                break;
                            }
                        }
                        catch (FalkonryClient.Service.FalkonryException e)
                        {
                            log.Error(e.GetBaseException() + "\n");
                            Console.ReadKey();
                            Environment.Exit(1);
                        }
                        catch (Exception ex)
                        {
                            log.WarnFormat(ex.Message + "\n" + "Retry Attempt: {0}", i + 1);
                        }
                    }
                    if (i == 3)
                    {
                        log.Error("Cannot add data to the datastream!");
                        Console.ReadKey();
                        Environment.Exit(1);
                    }
                }
                else
                {
                    try
                    {
                        inputStatus = falkonry.AddInputStream(datastreamId, stream, options);
                    }
                    catch (FalkonryClient.Service.FalkonryException e)
                    {
                        log.Error(e.GetBaseException() + "\n");
                    }
                }
            }
        }

        public void GetLiveOutput(String assessmentId)
        {
            void EventSource_Message(object sender, EventSource.ServerSentEventArgs e)
            {
                try
                {
                    var falkonryEvent = JsonConvert.DeserializeObject<FalkonryEvent>(e.Data);
                    log.Info(falkonryEvent.ToString() + "\n");
                }
                catch (System.Exception exception)
                {
                    log.Error(exception.Message);
                }

            }

            //On any error while getting live streaming output, EventSource_Error will be triggered
            void EventSource_Error(object sender, EventSource.ServerSentErrorEventArgs e)
            {
                Console.Write(e.Exception.Message + "\n");
                Console.Write(e.Exception.StackTrace + "\n");
            }

            EventSource eventSource = falkonry.GetOutput(assessmentId, null, null);
            eventSource.Message += EventSource_Message;
            eventSource.Error += EventSource_Error;

            log.Info("Press any key to stop listening.\n");
            Console.ReadKey();
            //eventSource.Dispose();
        }

        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

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

            //FileAdapter fileAdapter = new FileAdapter();
            //ADKConnnector aDK = new ADKConnnector();

            //var datastreamId = aDK.CreateDataStream();

            //String fileName = "fileName";
            //var stream = fileAdapter.GetData(fileName);
            //String fileType = "csv";
            //aDK.PostData(datastreamId, stream, fileType, liveStatus=false);

            //  ###############################################################################

            /*
                #################### For creating datastream and adding data from a stream  ################
                The below code will create a datastream and post the historical data as a stream from
                the file to the datastream. You will have to give the fileName and pass it to the
                getDataStream() method of the file adapter.
            */

            //FileAdapter fileAdapter = new FileAdapter();
            //ADKConnnector aDK = new ADKConnnector();

            //var datastreamId = aDK.CreateDataStream();

            //String fileName = "fileName";
            //var stream = fileAdapter.GetStream(fileName);
            //String fileType = "csv";
            //aDK.PostDataFromStream(datastreamId, stream, fileType, liveStatus = false);

            //  #############################################################################################

            /*
                #################### For live data input and output  ################
                The below code will create a datastream and post the historical data as a stream from
                the file to the datastream. You will have to give the fileName and pass it to the
                getDataStream() method of the file adapter.
                NOTE:-
                 1. Go on the Falkonry UI and build a model.
                 2. After building a model, run the code.
                 While using this method you can choose between postData(), postDataFromStream() and postMoreDataFromStream()
                 and set live parameter as true.
            */

            //FileAdapter fileAdapter = new FileAdapter();
            //ADKConnnector aDK = new ADKConnnector();

            //String datastreamId = "datastreamId";
            //String assessmentId = "assessmentId";

            //aDK.TurnOnLiveMonitoring(datastreamId);

            //String fileName = "fileName";
            //var stream = fileAdapter.GetStream(fileName);
            //String fileType = "csv";
            //aDK.PostDataFromStream(datastreamId, stream, fileType, liveStatus = true);

            //Parallel.Invoke(() =>
            //{
            //    aDK.PostDataFromStream(datastreamId, stream, fileType, liveStatus = true);
            //},
            //() =>
            //{
            //    aDK.GetLiveOutput(assessmentId);
            //});

            //aDK.TurnOffLiveMonitoring(datastreamId);

            //  #########################################################################

            /*
                #################### Example For creating datastream and adding data from a folder containing multiple files   ################
  
                The below code will create a datastream and post the historical data as a stream from
                the folder containing multiple files to the datastream. You will have to give the folder path and pass it to the
                addMoreHistoricalDataFromStream() in the adk connector
            */
            //ADKConnnector aDK = new ADKConnnector();

            //String folderPath = "folderPath";
            //String datastreamId = "datastreamId";
            //aDK.PostMoreDataFromStream(datastreamId, folderPath, liveStatus = false);

            //  ########################################################################################################

        }
    }
}
