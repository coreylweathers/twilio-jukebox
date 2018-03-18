using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using System;
using System.Net.Http;
using System.Threading.Tasks;

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
                var httpClient = new HttpClient();
                var result = await httpClient.GetAsync(new Uri("https://localhost:44319/api/request"));
               /*var hubConnection = new HubConnectionBuilder()
                    .WithConsoleLogger()
                    .WithUrl("https://localhost:44319/playlisthub")
                    .Build();

                hubConnection.StartAsync().Wait();
                var result = await hubConnection.InvokeAsync<string>("SendMessage", new string[] { "Corey", "test message" });*/

                log.Info($"The result is {result}");

            }
            catch (Exception ex)
            {
                log.Error(ex.Message);
            }
        }
    }
}
