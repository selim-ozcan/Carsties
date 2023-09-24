using MongoDB.Entities;

namespace SearchService;

public class AuctionSvcHttpClient
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public AuctionSvcHttpClient(HttpClient httpClient, IConfiguration configuration)
    {
        this._httpClient = httpClient;
        this._configuration = configuration;
    }

    public async Task<List<Item>> GetItemsForSearchDb()
    {
        var lastUpdated = await DB.Find<Item, string>()
            .Sort(a => a.Descending(a => a.UpdatedAt))
            .Project(a => a.UpdatedAt.ToString())
            .ExecuteFirstAsync();

        var items = await _httpClient.GetFromJsonAsync<List<Item>>(_configuration["AuctionServiceUrl"] + "/api/auctions");
        System.Console.WriteLine("afdasfafafasfafaf");
        System.Console.WriteLine(items);
        return items;
    }
}
