using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace Service
{
    public static class UpdateSpotifyPlaylist
    {
        [FunctionName("UpdateSpotifyPlaylist")]
        public static async Task Run([QueueTrigger("playlist", Connection = "AzureWebJobsStorage")]string myQueueItem, TraceWriter log, ExecutionContext context)
        {
            try
            {
                log.Info($"C# Queue trigger function processed: {myQueueItem}");
                var json = JObject.Parse(myQueueItem);

                var builder = new UriBuilder("https://localhost:44319/api/client");
                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string,string>("id", json["id"].ToString()),
                    new KeyValuePair<string, string>("name", json["name"].ToString())
                });

                var httpClient = new HttpClient();
                var result = await httpClient.PostAsync("https://localhost:44319/api/client", content);
                log.Info($"The result is {result}");

            }
            catch (Exception ex)
            {
                log.Error(ex.Message);
            }
        }
    }
}
