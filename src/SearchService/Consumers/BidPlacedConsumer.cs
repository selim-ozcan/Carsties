﻿using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace SearchService;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        var auction = await DB.Find<Item>().OneAsync(context.Message.AuctionId);
        
        if (context.Message.BidStatus.Contains("Accepted")
            && auction.CurrentHighBid < context.Message.Amount)
        {
            auction.CurrentHighBid = context.Message.Amount;

            await auction.SaveAsync();
        }
    }
}
