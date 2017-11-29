using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Twilio.TwiML;
using System.Web;
using System;
using Microsoft.WindowsAzure.Storage.Queue;
using System.Configuration;
using Newtonsoft.Json.Linq;

namespace Services
{
    public static class SendSmsResponse
    {
        [FunctionName("SendSmsResponse")]
        public static HttpResponseMessage Run([HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("Processing the initial request");
            var twilioResponse = new MessagingResponse();
            var httpResponse = new HttpResponseMessage(HttpStatusCode.OK);
            string twilioResponseBody = "";

            // TODO: Add code in here to deal with potential 409-CONFLICT error
            try
            {
                // Set name to query string or body data
                var body = HttpUtility.UrlDecode(req.Content.ReadAsStringAsync().Result);
                if (string.IsNullOrEmpty(body))
                {
                    throw new ArgumentException("Hey what's up. So in order to use this service, you have to give us the name of a song and its artist. Text this number again this information and let's see what happens.");
                }

                log.Verbose($"Here is the Twilio request: {body}");
                var result = body.Split('&').ToDictionary(pair => pair.Split('=')[0], pair => pair.Split('=')[1]);

                log.Verbose("Creating the queue references");
                CloudQueue cloudQueue = Helper.CreateQueueReference(ConfigurationManager.AppSettings["InitialRequestQueueName"]);
                log.Verbose("Completed created the queue references");

                var json = new JObject()
                {
                    ["messagesid"] = result["MessageSid"],
                    ["request"] = result["Body"]
                };

                log.Verbose($"Here is the JSON request: {json.ToString()}");
                Helper.AddMessageToQueue(cloudQueue, json);
                log.Info("The message has been added to the initial request queue");
                twilioResponseBody = "Thank you for your request. Your request has been queued";
            }
            catch (ArgumentException ex)
            {
                log.Error($"InitialRequest has caught an ArgumentException: {ex.Message}", ex);
                twilioResponseBody = ex.Message;
            }
            catch (FormatException ex)
            {
                log.Error($"InitialRequest has caught a FormatException: {ex.Message}", ex);
                twilioResponseBody = ex.Message;
            }
            catch (Exception ex)
            {
                twilioResponseBody = "An expected error has occurred. Please contact Corey and share this message with him";
                log.Error($"An unexpected error has occurred: {ex.Message}", ex);
            }
            finally
            {
                twilioResponse.Message(twilioResponseBody);
                httpResponse.Content = new StringContent(twilioResponse.ToString());
                httpResponse.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/xml");
            }

            return httpResponse;
        }
    }
}
