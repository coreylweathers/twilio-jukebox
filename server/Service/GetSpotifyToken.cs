
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System.Net.Http;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace Service
{
    public static class GetSpotifyToken
    {
        [FunctionName("GetSpotifyToken")]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "spotifytoken")]HttpRequest req, TraceWriter log, ExecutionContext context)
        {
            log.Info("C# HTTP trigger function processed a request.");
            try
            {
                var config = Helper.GetConfigurationInstance(context.FunctionAppDirectory);
                var clientId = config["Values:ClientId"];
                var clientSecret = config["Values:ClientSecret"];

                string code = req.Query["code"];
                string bearer = Convert.ToBase64String(System.Text.ASCIIEncoding.ASCII.GetBytes($"{clientId}:{clientSecret}"));

                var client = new HttpClient();
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Add("Authorization", $"Basic {bearer}");
                var response = await client.PostAsync("https://accounts.spotify.com/api/token", new FormUrlEncodedContent(new[]{
                new KeyValuePair<string,string>("grant_type","authorization_code"),
                new KeyValuePair<string,string>("code",code),
                new KeyValuePair<string, string>("redirect_uri", "http://localhost:4200/callback")
            }));
                response.EnsureSuccessStatusCode();

                var json = JObject.Parse(await response.Content.ReadAsStringAsync());

                var result = new
                {
                    access_token = json["access_token"].ToString(),
                    refresh_token = json["refresh_token"].ToString()
                };
                config["refresh_token"] = json["refresh_token"].ToString();
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                log.Error($"An exception has occurred: {ex.Message}");
            }
            return new StatusCodeResult(500);
        }
    }
}
