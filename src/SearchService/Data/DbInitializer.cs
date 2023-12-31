﻿using System.Text.Json;
using MongoDB.Driver;
using MongoDB.Entities;

namespace SearchService;

public class DbInitializer
{

    public static async Task InitDb(WebApplication app)
    {
        await DB.InitAsync("SearchDb", MongoClientSettings.FromConnectionString(app.Configuration.GetConnectionString("MongoDbConnection")));

        await DB.Index<Item>()
            .Key(x => x.Make, KeyType.Text)
            .Key(x => x.Color, KeyType.Text)
            .Key(x => x.Model, KeyType.Text)
            .CreateAsync();

        var count = await DB.CountAsync<Item>();

        using var scope = app.Services.CreateScope();
        
        var httpClient = scope.ServiceProvider.GetService<AuctionSvcHttpClient>();
        var items = await httpClient.GetItemsForSearchDb();

        if (items.Count > 0) await DB.SaveAsync(items);  
        
    }
}
