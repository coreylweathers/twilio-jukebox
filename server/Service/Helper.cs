using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public static class Helper
    {
        public static string QueueName
        {
            get { return "sms"; }
        }

        public static async Task<CloudQueue> CreateQueueReferenceAsync(string queue, string connectionString)
        {
            var storageAccount = CloudStorageAccount.Parse(connectionString);
            var queueClient = storageAccount.CreateCloudQueueClient();
            var cloudQueue = queueClient.GetQueueReference(queue);
            await cloudQueue.CreateIfNotExistsAsync();
            return cloudQueue;
        }

        public static async Task AddMessageToQueueAsync(CloudQueue cloudQueue, JObject messageJson)
        {
            CloudQueueMessage queueMessage = await CreateQueueMessageAsync(cloudQueue, messageJson);
            var result = cloudQueue.UpdateMessageAsync(queueMessage, new TimeSpan(0, 0, 0), MessageUpdateFields.Content | MessageUpdateFields.Visibility);
        }

        private static async Task<CloudQueueMessage> CreateQueueMessageAsync(CloudQueue cloudQueue, JObject json)
        {
            var queueMessage = new CloudQueueMessage("");
            await cloudQueue.AddMessageAsync(queueMessage);
            json["initialid"] = queueMessage.Id;
            json["initialpopreceipt"] = queueMessage.PopReceipt;
            queueMessage.SetMessageContent(json.ToString(Newtonsoft.Json.Formatting.None));
            return queueMessage;
        }

        public static IConfigurationRoot GetConfigurationInstance(string functionAppDirectory)
        {
            return new ConfigurationBuilder()
                 .SetBasePath(functionAppDirectory)
                 .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                 .AddEnvironmentVariables()
                 .Build();

        }
    }
}
