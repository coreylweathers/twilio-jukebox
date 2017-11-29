using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public static class Helper
    {
        public static CloudQueue CreateQueueReference(string queue)
        {
            var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.AppSettings["AzureWebJobsStorage"]);
            var queueClient = storageAccount.CreateCloudQueueClient();
            var cloudQueue = queueClient.GetQueueReference(queue);
            cloudQueue.CreateIfNotExists();
            return cloudQueue;
        }

        public static void AddMessageToQueue(CloudQueue cloudQueue, JObject messageJson)
        {
            CloudQueueMessage queueMessage = CreateQueueMessage(cloudQueue, messageJson);
            cloudQueue.UpdateMessage(queueMessage, new TimeSpan(0, 0, 0), MessageUpdateFields.Content | MessageUpdateFields.Visibility);
        }

        private static CloudQueueMessage CreateQueueMessage(CloudQueue cloudQueue, JObject json)
        {
            var queueMessage = new CloudQueueMessage("");
            cloudQueue.AddMessage(queueMessage, null, new TimeSpan(0, 0, 30));
            json["initialid"] = queueMessage.Id;
            json["initialpopreceipt"] = queueMessage.PopReceipt;
            queueMessage.SetMessageContent(json.ToString(Newtonsoft.Json.Formatting.None));
            return queueMessage;
        }
    }
}
