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
    class ADKConnLive
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

        /*
        *  Adding live data to an existing datastream. (As a String)
        */
        /// <summary>
        /// Adding live data to an existing datastream.
        /// </summary>
        /// <exception cref="System.ArgumentNullException">Thrown when one parameter is missing 
        /// in the function call.</exception>
        /// <exception cref="FalkonryClient.Service.FalkonryException">Generally thrown when there is a request timeout.</exception>
        /// <exception cref="System.Exception">Thrown when any other error causes 
        /// the program to not add live data.</exception>
        /// <param name="datastreamId">A String that contains the ID of existing datastream 
        /// in which the live data is supposed to be ingested.</param>
        /// <param name="stream">A String received from file-adapter's GetData() method.</param>
        /// <param name="fileType">A String that specifies the file type i.e CSV/JSON.</param>
        public void IngestData(String datastreamId, String stream, String fileType)
        {
            if (fileType == null || datastreamId == null || stream == null)
            {
                throw new ArgumentNullException(nameof(fileType));
            }

            Datastream datastream = falkonry.GetDatastream(datastreamId);

            var options = new SortedDictionary<string, string>();
            var inputStatus = new InputStatus();
            options.Add("streaming", "true");
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

            try
            {
                inputStatus = falkonry.AddInput(datastreamId, stream, options);
                log.Info(inputStatus.Status + " - " + inputStatus.Message + "\n");
            }
            catch (FalkonryClient.Service.FalkonryException e)
            {
                log.Error(e.GetBaseException() + "\n");
                Console.ReadKey();
                Environment.Exit(1);
            }
            catch (Exception ex)
            {
                log.Error(ex.GetBaseException() + "\n");
                Console.ReadKey();
                Environment.Exit(1);
            }

        }

        /*
         *  Adding live data from stream to an existing datastream.(In form of Bytes)
         */
        /// <summary>
        /// Adding live data to an existing datastream.
        /// </summary>
        /// <exception cref="System.ArgumentNullException">Thrown when one parameter is missing 
        /// in the function call.</exception>
        /// <exception cref="FalkonryClient.Service.FalkonryException">Generally thrown when there is a request timeout.</exception>
        /// <exception cref="System.Exception">Thrown when any other error causes 
        /// the program to not add live data.</exception>
        /// <param name="datastreamId">A String that contains the ID of existing datastream 
        /// in which the live data is supposed to be ingested.</param>
        /// <param name="stream">A byte array received from file-adapter's GetStream() method.</param>
        /// <param name="fileType">A String that specifies the file type i.e CSV/JSON.</param>
        public void IngestDataFromFile(String datastreamId, byte[] stream, String fileType)
        {
            if (fileType == null || datastreamId == null || stream == null)
            {
                throw new ArgumentNullException(nameof(fileType));
            }

            Datastream datastream = falkonry.GetDatastream(datastreamId);

            var options = new SortedDictionary<string, string>();
            var inputStatus = new InputStatus();
            options.Add("streaming", "true");
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

            try
            {
                inputStatus = falkonry.AddInputStream(datastreamId, stream, options);
                log.Info(inputStatus.Status + " - " + inputStatus.Message + "\n");
            }
            catch (FalkonryClient.Service.FalkonryException e)
            {
                log.Error(e.GetBaseException() + "\n");
                Console.ReadKey();
                Environment.Exit(1);
            }
            catch (Exception ex)
            {
                log.Error(ex.GetBaseException() + "\n");
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
        /// <exception cref="FalkonryClient.Service.FalkonryException">Generally thrown when there is a request timeout.</exception>
        /// <exception cref="System.Exception">Thrown when any other error causes 
        /// the program to not add live data.</exception>
        /// <param name="datastreamId">A String that contains the ID of existing datastream 
        /// in which the live data is supposed to be added.</param>
        /// <param name="folderPath">Complete folder path where the data files
        /// are stored</param>
        public void IngestDataFromFolder(String datastreamId, String folderPath)
        {
            if (datastreamId == null || folderPath == null)
            {
                throw new ArgumentNullException(nameof(datastreamId));
            }

            String fileType;
            FileAdapter fileAdapter = new FileAdapter();
            Datastream datastream = falkonry.GetDatastream(datastreamId);

            var options = new SortedDictionary<string, string>();
            var inputStatus = new InputStatus();
            options.Add("streaming", "true");
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
                try
                {
                    inputStatus = falkonry.AddInputStream(datastreamId, stream, options);
                    log.Info(inputStatus.Status + " - " + inputStatus.Message + "\n");
                }
                catch (FalkonryClient.Service.FalkonryException e)
                {
                    log.Error(e.GetBaseException() + "\n");
                    Console.ReadKey();
                    Environment.Exit(1);
                }
                catch (Exception ex)
                {
                    log.Error(ex.GetBaseException() + "\n");
                    Console.ReadKey();
                    Environment.Exit(1);
                }
            }
        }

        /*
         *  This method is used get the streaming output or live data
         *  output which is only visible if there is a live datastream
         *  on or by calling our IngestData method and this method
         *  can only be used if you have trained a model on Falkonry UI
         *  and then turned ON LIVE button on Falkonry UI.
         */
        /// <summary>
        /// This method is used to get the streaming output or live data output
        /// </summary>
        /// <remarks>
        /// Should only be used when there is a live datastream
        /// or by calling IngestData Method.
        /// Can only be used if a model is trained on Falkonry UI and
        /// Live is turned ON.
        /// </remarks>
        /// <param name="assessmentId">A String that contains the ID of existing assessment 
        /// from where the live output will be obtained.</param>
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
                log.Error(e.Exception.Message + "\n");
                log.Error(e.Exception.StackTrace + "\n");
            }

            EventSource eventSource = falkonry.GetOutput(assessmentId, null, null);
            eventSource.Message += EventSource_Message;
            eventSource.Error += EventSource_Error;

            log.Info("Press any key to stop listening.\n");
            Console.ReadKey();
            //eventSource.Dispose();
        }
    }
}
