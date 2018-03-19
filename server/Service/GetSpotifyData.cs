using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json.Linq;
using SpotifyAPI.Web;
using SpotifyAPI.Web.Auth;
using SpotifyAPI.Web.Enums;
using SpotifyAPI.Web.Models;

namespace Service
{
    public static class GetSpotifyData
    {
        [FunctionName("GetSpotifyData")]
        public static async Task Run([QueueTrigger("sms", Connection = "AzureWebJobsStorage")]string myQueueItem, TraceWriter log,ExecutionContext context)
        {
            log.Info($"C# Queue trigger function processed: {myQueueItem}");
            // TODO: Handle badly formatted json request string
            var config = Helper.GetConfigurationInstance(context.FunctionAppDirectory);
            var json = JObject.Parse(myQueueItem);

            // TODO: Get the creds from the config settings
            var track = await SelectSpotifyResult(json["request"].ToString(), config["Values:ClientId"], config["Values:ClientSecret"]  );
            var update = new
            {
               id = track.Id,
               name = track.Name
            };

            var storageConnectionString = config["Values:AzureWebJobsStorage"];
            var playlist = config["Values:PlaylistQueue"];

            var playlistQueue = await Helper.CreateQueueReferenceAsync(playlist, storageConnectionString);
            await Helper.AddMessageToQueueAsync(playlistQueue, JObject.FromObject(update));

            log.Info("This thing actually works");
        }

        private static async Task<FullTrack> SelectSpotifyResult(string query, string clientId, string clientSecret)
        {
            var auth = new ClientCredentialsAuth()
            {
                ClientId = clientId,
                ClientSecret = clientSecret,
                Scope = Scope.UserReadPrivate,
            };

            var token = auth.DoAuth();
            var spotify = new SpotifyWebAPI()
            {
                TokenType = token.TokenType,
                AccessToken = token.AccessToken,
                UseAuth = true
            };

            List<FullTrack> tracks;
            var searchResult = await spotify.SearchItemsAsync(query, SearchType.Track);
            tracks = new List<FullTrack>(searchResult.Tracks.Total);
            tracks.AddRange(searchResult.Tracks.Items);

            while (searchResult.Tracks.HasNextPage())
            {
                var parts = searchResult.Tracks.Next.Split('?')[1].Split('&');
                var offset = int.Parse(parts[2].Split('=')[1]);
                var limit = int.Parse(parts[3].Split('=')[1]);
                searchResult = await spotify.SearchItemsAsync(query, SearchType.Track, limit: limit, offset: offset);
                tracks.AddRange(searchResult.Tracks.Items);
            }

            var result = tracks.OrderByDescending(x => x.Popularity).FirstOrDefault();
            return result;
        }
    }
}
