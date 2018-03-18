using Microsoft.Extensions.Configuration;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using Microsoft.WindowsAzure.Storage;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using Twilio.TwiML;
using System;
using System.Linq;

namespace Service
{
    public static class QueueSmsRequest
    {
        public static ConfigurationBuilder Config { get; set; }

        [FunctionName("QueueSmsRequest")]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = "request")]HttpRequest req, TraceWriter log, ExecutionContext context)
        {
            log.Info("C# HTTP trigger function processed a request.");
            var result = new ContentResult()
            {
                ContentType = "application/xml"
            };
            var response = new MessagingResponse();

            try
            {
                var config = Helper.GetConfigurationInstance(context.FunctionAppDirectory);
                var storageConnectionString = config["Values:AzureWebJobsStorage"];

                if (string.IsNullOrEmpty(storageConnectionString))
                {
                    log.Error("Unable to load a connection string for the queue. Please check your queue configuration.");
                    throw new NullReferenceException();
                }

                var query = req.Form.FirstOrDefault(x => x.Key.Equals("body", StringComparison.CurrentCultureIgnoreCase));
                var json = JObject.FromObject(new
                {
                    request = query.Value.ToString()
                });

                var queue = await Helper.CreateQueueReferenceAsync(config["Values:SmsQueue"], storageConnectionString);
                // TODO: Handle scenario of message not being added to the queue
                await Helper.AddMessageToQueueAsync(queue, json);

                response.Message("Thanks for your request. We're queueing it up for you right now!");
            }
            catch (Exception ex)
            {
                log.Error($"Unfortunately an error has occurred: {ex.Message}");
                response.Message("Sorry we're unable to save your request. Give us a second before you try it again. I promise it's well worth it");
            }
            finally
            {
                result.Content = response.ToString();
            }

            return result;
        }
    }
}
