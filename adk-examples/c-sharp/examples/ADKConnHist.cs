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
    class ADKConnHist
    {
        static String url = "https://example.falkonry.ai";
        static String token = "token";
        Falkonry falkonry = new Falkonry(url, token);
        DatastreamRequest ds = new DatastreamRequest();
        Datasource dataSource = new Datasource();
        Field field = new Field();
        Time time = new Time();
        Signal signal = new Signal();

        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// This method checks for the data ingestion status and returns an integer 
        /// according to the status.
        /// </summary>
        /// <exception cref = "System.Exception" > Thrown when the status of the tracker
        /// comes out to be FAILED or ERROR.</exception>
        /// <param name = "trackerId" > A string which is an ID to the tracker for which status is
        /// to be checked.</param>
        /// <returns>An integer 1 or 0, depending on the status.</returns>
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
                    log.Info(tracker.Status + "\n");
                    return 1;
                }
                System.Threading.Thread.Sleep(5000);
            }
            return 0;
        }

        /*
         *  Creates a new datastream on the Merlin.
         */
        /// <summary>
        /// Creates a new datastream on the Merlin.
        /// </summary>
        /// <returns>
        /// The ID of the datastream created.
        /// </returns>
        public String CreateDataStream()
        {
            String datastreamName = "C#_TEST_7";
            String timeZone = "GMT";
            String timeIdentifier = "time";
            String timeFormat = "millis";
            String PrecisionFormat = "millis";
            String entityIdentifier = "entity";

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

            //          ###  USE THIS IF YOUR DATA IS IN NARROW FORMAT  ###
            //          TODO: Uncomment these 2 lines out for Narrow Datastream Format.
            //String signalIdentifier = "signal";
            //String valueIdentifier = "value";
            //ds.Field.Signal.SignalIdentifier = signalIdentifier;
            //ds.Field.Signal.ValueIdentifier = valueIdentifier;

            //          ### USE THIS IF YOU HAVE BATCH DATA ###
            //          TODO: Uncomment this line out for Batch window type.
            //String batchIdentifier = "batch_id";
            //ds.Field.BatchIdentifier = batchIdentifier;

            Datastream datastream = falkonry.CreateDatastream(ds);
            log.InfoFormat("New Datastream with id {0} created. \n", datastream.Id);
            return datastream.Id;
        }

        /*
         * Adds Historical data to an existing datastream.
         */
        /// <summary>
        /// Adds Historical data to an existing datastream.
        /// </summary>
        /// <exception cref="System.ArgumentNullException">Thrown when one parameter is missing 
        /// in the function call.</exception>
        /// <exception cref="FalkonryClient.Service.FalkonryException">Thrown when a 100 second timeout 
        /// is met.</exception>
        /// <exception cref="System.Exception">Thrown when any other error causes 
        /// the program to not add historical data.</exception>
        /// <param name="datastreamId">A String that contains the ID of existing datastream 
        /// in which the historical data is supposed to be added.</param>
        /// <param name="stream">A String received from file-adapter's GetData() method.</param>
        /// <param name="fileType">A String that specifies the file type i.e CSV/JSON.</param>
        public void IngestData(String datastreamId, String stream, String fileType)
        {
            if (fileType == null || datastreamId == null || stream == null)
            {
                throw new ArgumentNullException(nameof(fileType));
            }

            int i;
            Datastream datastream = falkonry.GetDatastream(datastreamId);

            var options = new SortedDictionary<string, string>();
            var inputStatus = new InputStatus();
            options.Add("streaming", "false");
            options.Add("hasMoreData", "false");
            options.Add("timeIdentifier", datastream.Field.Time.Identifier.ToString());
            options.Add("timeZone", datastream.Field.Time.Zone.ToString());
            options.Add("timeFormat", datastream.Field.Time.Format.ToString());
            options.Add("entityIdentifier", datastream.Field.EntityIdentifier.ToString());
            options.Add("fileFormat", fileType);

            //          TODO: Uncomment these 2 lines out for Narrow Datastream Format.            
            //options.Add("signalIdentifier", datastream.Field.Signal.SignalIdentifier.ToString());
            //options.Add("valueIdentifier", datastream.Field.Signal.ValueIdentifier.ToString());

            //          TODO: Uncomment this line out for Batch Datastream Format.
            //options.Add("batchIdentifier", datastream.Field.BatchIdentifier.ToString());

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
                    log.WarnFormat(ex.StackTrace + " \n" + ex.Message + "\n" + "Retry Attempt: {0}", i + 1);
                }
            }
            if (i == 3)
            {
                log.Error("Cannot add data to the datastream!");
                Console.ReadKey();
                Environment.Exit(1);
            }
        }

        /*
         * Adds Historical data to an existing datastream.
         */
        /// <summary>
        /// Adds Historical data to an existing datastream.
        /// </summary>
        /// <exception cref="System.ArgumentNullException">Thrown when one parameter is missing 
        /// in the function call.</exception>
        /// <exception cref="FalkonryClient.Service.FalkonryException">Thrown when a 100 second timeout 
        /// is met.</exception>
        /// <exception cref="System.Exception">Thrown when any other error causes 
        /// the program to not add historical data.</exception>
        /// <param name="datastreamId">A String that contains the ID of existing datastream 
        /// in which the historical data is supposed to be added.</param>
        /// <param name="stream">A byte array received from file-adapter's GetStream() method.</param>
        /// <param name="fileType">A String that specifies the file type i.e CSV/JSON.</param>
        public void IngestDataFromFile(String datastreamId, byte[] stream, String fileType)
        {
            if (fileType == null || datastreamId == null || stream == null)
            {
                throw new ArgumentNullException(nameof(fileType));
            }

            int i;
            Datastream datastream = falkonry.GetDatastream(datastreamId);

            var options = new SortedDictionary<string, string>();
            var inputStatus = new InputStatus();
            options.Add("streaming", "false");
            options.Add("hasMoreData", "false");
            options.Add("timeIdentifier", datastream.Field.Time.Identifier.ToString());
            options.Add("timeZone", datastream.Field.Time.Zone.ToString());
            options.Add("timeFormat", datastream.Field.Time.Format.ToString());
            options.Add("entityIdentifier", datastream.Field.EntityIdentifier.ToString());
            options.Add("fileFormat", fileType);

            //          TODO: Uncomment these 2 lines out for Narrow Datastream Format.            
            //options.Add("signalIdentifier", datastream.Field.Signal.SignalIdentifier.ToString());
            //options.Add("valueIdentifier", datastream.Field.Signal.ValueIdentifier.ToString());

            //          TODO: Uncomment this line out for Batch Datastream Format.
            //options.Add("batchIdentifier", datastream.Field.BatchIdentifier.ToString());

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
                    log.WarnFormat(ex.StackTrace + " \n" + ex.Message + "\n" + "Retry Attempt: {0}", i + 1);
                }
            }
            if (i == 3)
            {
                log.Error("Cannot add data to the datastream!");
                Console.ReadKey();
                Environment.Exit(1);
            }
        }

        /*
         *  This method is just an example to show how our ADK manages
         *  multiple data files in a particular folder. It reads all
         *  the files and passes each one of them as a stream to an existing
         *  datastream.
         */
        /// <summary>
        /// This method is just an example to show how our ADK manages
        /// multiple data files in a particular folder. It reads all the files
        /// and passes each one of them as a stream to an existing datastream.
        /// </summary>
        /// <exception cref="System.ArgumentNullException">Thrown when one parameter is missing 
        /// in the function call.</exception>
        /// <exception cref="FalkonryClient.Service.FalkonryException">Thrown when a 100 second timeout 
        /// is met.</exception>
        /// <exception cref="System.Exception">Thrown when any other error causes 
        /// the program to not add historical data.</exception>
        /// <param name="datastreamId">A String that contains the ID of existing datastream 
        /// in which the historical data is supposed to be added.</param>
        /// <param name="folderPath">Complete folder path where the data files
        /// are stored</param>
        public void IngestDataFromFolder(String datastreamId, String folderPath)
        {
            if (datastreamId == null || folderPath == null)
            {
                throw new ArgumentNullException(nameof(datastreamId));
            }

            String fileType;
            int i;
            FileAdapter fileAdapter = new FileAdapter();
            Datastream datastream = falkonry.GetDatastream(datastreamId);

            var options = new SortedDictionary<string, string>();
            var inputStatus = new InputStatus();
            options.Add("streaming", "false");
            options.Add("hasMoreData", "true");
            options.Add("timeIdentifier", datastream.Field.Time.Identifier.ToString());
            options.Add("timeZone", datastream.Field.Time.Zone.ToString());
            options.Add("timeFormat", datastream.Field.Time.Format.ToString());
            options.Add("entityIdentifier", datastream.Field.EntityIdentifier.ToString());
            options.Add("fileFormat", "csv");

            //          TODO: Uncomment these 2 lines out for Narrow Datastream Format.            
            //options.Add("signalIdentifier", datastream.Field.Signal.SignalIdentifier.ToString());
            //options.Add("valueIdentifier", datastream.Field.Signal.ValueIdentifier.ToString());

            //          TODO: Uncomment this line out for Batch Datastream Format.
            //options.Add("batchIdentifier", datastream.Field.BatchIdentifier.ToString());

            String[] Files = Directory.GetFiles(folderPath + "\\", "*.csv");
            String[] Files2 = Directory.GetFiles(folderPath + "\\", "*.json");
            Files = Files.Concat(Files2).ToArray();
            var fileCount = Files.Length;

            foreach (String file in Files)
            {
                byte[] stream = fileAdapter.GetStream(file);
                fileType = System.IO.Path.GetExtension(file).ToString().Substring(1, System.IO.Path.GetExtension(file).ToString().Length - 1);
                options["fileFormat"] = fileType;
                if (fileCount == 1)
                {
                    options["hasMoreData"] = "false";
                }
                fileCount--;

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
        }

        /// <summary>
        /// This method adds facts to an existing datastream.
        /// </summary>
        /// <exception cref="System.ArgumentNullException">Thrown when one parameter is missing 
        /// in the function call.</exception>
        /// <exception cref="FalkonryClient.Service.FalkonryException">Thrown when a 100 second timeout 
        /// is met.</exception>
        /// <exception cref="System.Exception">Thrown when any other error causes 
        /// the program to not add facts.</exception>
        /// <param name="datastreamId">A String that contains the ID of existing datastream 
        /// in which the facts are supposed to be added.</param>
        /// <param name="assessmentId">A String that contains the ID of the assessment 
        /// in which the facts are supposed to be added.</param>
        /// <param name="stream">A String received from file-adapter's GetData() method.</param>
        /// <param name="fileType">A String that specifies the file type i.e CSV/JSON.</param>
        public void IngestFactsData(String datastreamId, String assessmentId, String stream, String fileType)
        {
            if (fileType == null || datastreamId == null || stream == null || assessmentId == null)
            {
                throw new ArgumentNullException(nameof(fileType));
            }

            int i;
            Datastream datastream = falkonry.GetDatastream(datastreamId);

            var options = new SortedDictionary<string, string>();
            var inputStatus = new InputStatus();
            //          TODO: Change the name of the start time identifier according to your data.
            options.Add("startTimeIdentifier", "time");

            //          TODO: Change the name of the end time identifier according to your data.
            options.Add("endTimeIdentifier", "end");

            //          TODO: Change the value of the time format according to your data.
            options.Add("timeFormat", datastream.Field.Time.Format.ToString());

            //          TODO: Change the value of the time zone according to your data.
            options.Add("timeZone", datastream.Field.Time.Zone.ToString());

            //          TODO: Change the name of the entity identifier according to your data.
            options.Add("entityIdentifier", datastream.Field.EntityIdentifier.ToString());

            //          TODO: Change the name of the value identifier according to your data.
            options.Add("valueIdentifier", "activity");

            //          TODO: Uncomment this line if your facts data has any keyword identifier.
            //options.Add("keywordIdentifier", "Tag");

            for (i = 0; i < 3; i++)
            {
                try
                {
                    inputStatus = falkonry.AddFacts(assessmentId, stream, options);
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
                log.Error("Cannot add facts to the datastream!");
                Console.ReadKey();
                Environment.Exit(1);
            }
        }

        /// <summary>
        /// This method adds facts to an existing datastream.
        /// </summary>
        /// <exception cref="System.ArgumentNullException">Thrown when one parameter is missing 
        /// in the function call.</exception>
        /// <exception cref="FalkonryClient.Service.FalkonryException">Thrown when a 100 second timeout 
        /// is met.</exception>
        /// <exception cref="System.Exception">Thrown when any other error causes 
        /// <param name="datastreamId">A String that contains the ID of existing datastream 
        /// in which the facts are supposed to be added.</param>
        /// <param name="assessmentId">A String that contains the ID of the assessment 
        /// in which the facts are supposed to be added.</param>
        /// <param name="stream">A byte array received from file-adapter's GetStream() method.</param>
        /// <param name="fileType">A String that specifies the file type i.e CSV/JSON.</param>
        public void IngestFactsFromFile(String datastreamId, String assessmentId, byte[] stream, String fileType)
        {
            if (fileType == null || datastreamId == null || stream == null || assessmentId == null)
            {
                throw new ArgumentNullException(nameof(fileType));
            }

            int i;
            Datastream datastream = falkonry.GetDatastream(datastreamId);

            var options = new SortedDictionary<string, string>();
            var inputStatus = new InputStatus();

            //          TODO: Change the name of the start time identifier according to your data.
            options.Add("startTimeIdentifier", "time");

            //          TODO: Change the name of the end time identifier according to your data.
            options.Add("endTimeIdentifier", "end");

            //          TODO: Change the value of the time format according to your data.
            options.Add("timeFormat", datastream.Field.Time.Format.ToString());

            //          TODO: Change the value of the time zone according to your data.
            options.Add("timeZone", datastream.Field.Time.Zone.ToString());

            //          TODO: Change the name of the entity identifier according to your data.
            options.Add("entityIdentifier", datastream.Field.EntityIdentifier.ToString());

            //          TODO: Change the name of the value identifier according to your data.
            options.Add("valueIdentifier", "value");

            //          TODO: Uncomment this line if your facts data has any keyword identifier.
            //options.Add("keywordIdentifier", "Tag");

            for (i = 0; i < 3; i++)
            {
                try
                {
                    inputStatus = falkonry.AddFactsStream(assessmentId, stream, options);
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
                log.Error("Cannot add facts to the datastream!");
                Console.ReadKey();
                Environment.Exit(1);
            }
        }

        /// <summary>
        /// This method exports the facts from a particular assessment to a file.
        /// </summary>
        /// <param name="datastreamId">A String that contains the ID of existing datastream 
        /// from which the facts are exported.</param>
        /// <param name="assessmentId">A String that contains the ID of existing assessment 
        /// from which the facts are exported.</param>
        public void ExportFacts(String datastreamId, String assessmentId)
        {
            Datastream datastream = falkonry.GetDatastream(datastreamId);
            //String path = "G:\\Falkonry\\July 1\\ConsoleApp2\\ConsoleApp2\\bin\\Debug\\facts\\" + datastream.Name + DateTime.Now + ".txt";
            String path = "G:\\Falkonry\\July 1\\ConsoleApp2\\ConsoleApp2\\bin\\Debug\\facts";
            String fileName = datastream.Name + "_" + DateTime.Now.ToString().Replace(":", "-") + ".json";
            StreamWriter sw = File.CreateText(Path.Combine(path, fileName));
            var options = new SortedDictionary<string, string>();
            options.Add("responseFormat", "application/json");
            var factsData = falkonry.getFacts(assessmentId, options);
            sw.Write(factsData.Response);
            sw.Close();
            log.Info("Facts export successful");
        }

    }
}
