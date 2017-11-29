using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;

namespace Services
{
    public static class GetSpotifyData
    {
        [FunctionName("GetSpotifyData")]
        public static void Run([QueueTrigger("myqueue-items", Connection = "AzureWebJobsStorage")]string myQueueItem, TraceWriter log)
        {
            log.Info($"C# Queue trigger function processed: {myQueueItem}");
            // TODO: Add logic here to connect to Spotify
        }
    }
}
