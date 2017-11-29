using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using System.Configuration;
using Newtonsoft.Json.Linq;
using Microsoft.WindowsAzure.Storage.Queue;
using Newtonsoft.Json;
using System.Web;
using System.Net.Http;

namespace Services
{
    public static class GetMLResult
    {
        [FunctionName("GetMLResult")]
        public static void Run([QueueTrigger("request", Connection = "AzureWebJobsStorage")]string myQueueItem, TraceWriter log)
        {
            log.Info($"C# Queue trigger function processing: {myQueueItem}");
            var initialRequestQueue = Helper.CreateQueueReference(ConfigurationManager.AppSettings["InitialRequestQueueName"]);
            var parsedRequestQueue = Helper.CreateQueueReference(ConfigurationManager.AppSettings["ParsedRequestQueueName"]);

            var parsedResponse = new JObject();
            var parsedQueueMessage = new CloudQueueMessage("");
            var queuedRequest = JObject.Parse(myQueueItem);

            try
            {
                parsedResponse["messagesid"] = queuedRequest["messagesid"];
                log.Verbose("Created the json object used to figure out ");
                var luisResponseBody = GetNLPResult(log, queuedRequest);
                ParseNLPResults(queuedRequest, parsedResponse, luisResponseBody);

                if (parsedResponse["song"] == null && parsedResponse["artist"] != null)
                {
                    var tempRequest = queuedRequest["request"].ToString(); ;
                    parsedResponse["song"] = tempRequest.Substring(0, tempRequest.Length - parsedResponse["artist"].ToString().Length);
                }
            }
            catch (JsonReaderException ex)
            {
                log.Error($"There was an issue reading JSON data: {ex.Message}", ex);
            }
            catch (ConfigurationErrorsException ex)
            {
                log.Error($"There was an issue reading configuration data: {ex.Message}", ex);
            }
            catch (HttpParseException ex)
            {
                log.Warning($"There was an unexpected error: {ex.Message}. Sending the message straight through to the SDK lookup");
                parsedResponse["song"] = queuedRequest["request"].ToString();
            }
            catch (HttpException ex)
            {
                log.Error($"There was an HTTP error that occurred: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                log.Error($"An unexpected error has occurred: {ex.Message}", ex);
            }
            finally
            {
                log.Verbose($"Adding {parsedResponse.ToString()} to the parsed queue");
                parsedRequestQueue.AddMessage(parsedQueueMessage, null, new TimeSpan(0, 0, 30));
                parsedResponse["parsedid"] = parsedQueueMessage.Id;
                parsedResponse["parsedpopreciept"] = parsedQueueMessage.PopReceipt;
                parsedQueueMessage.SetMessageContent(parsedResponse.ToString());
                parsedRequestQueue.UpdateMessage(parsedQueueMessage, new TimeSpan(0, 0, 0), MessageUpdateFields.Content | MessageUpdateFields.Visibility);
                log.Info($"Item successfully added");

                var initialQueueMessage = initialRequestQueue.GetMessage() ?? initialRequestQueue.PeekMessage();
                if (initialQueueMessage != null)
                {
                    log.Verbose($"Removing {queuedRequest.ToString()} from the initial request queue");
                    initialRequestQueue.DeleteMessage(queuedRequest["initialid"].ToString(), queuedRequest["initialpopreceipt"].ToString());
                    log.Verbose($"Item successfully removed from initial queue");
                }

                log.Info("C# Queue trigger function successfully parsed request");
            }
        }


        private static void ParseNLPResults(JObject queuedRequest, JObject parsedResponse, string luisResponseBody)
        {
            var json = JObject.Parse(luisResponseBody);

            if (!json["entities"].HasValues)
            {
                throw new HttpParseException($"The natural language parser was unable to determine the song and artist from the query {queuedRequest["Request"]}. Please try again");
            }

            foreach (var entry in json["entities"])
            {
                if (entry["type"].ToString().Contains("SongName"))
                {
                    parsedResponse["song"] = entry["entity"].ToString();
                }
                else if (entry["type"].ToString().Contains("Artist"))
                {
                    parsedResponse["artist"] = entry["entity"].ToString();
                }
            }
        }

        private static string GetNLPResult(TraceWriter log, JObject queuedRequest)
        {
            var luisUrl = HttpUtility.ParseQueryString(ConfigurationManager.AppSettings["LUISParser"]);
            luisUrl.Set("q", queuedRequest["request"].ToString());

            log.Verbose("Sending the request to LUIS");
            var httpClient = new HttpClient();
            var httpResponse = httpClient.GetAsync(HttpUtility.UrlDecode(luisUrl.ToString())).Result;

            if (!httpResponse.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"Unable to get a response from LUIS. The HTTP response status was {httpResponse.StatusCode}");
            }

            var luisResponseBody = httpResponse.Content.ReadAsStringAsync().Result;
            return luisResponseBody;
        }
    }
}
