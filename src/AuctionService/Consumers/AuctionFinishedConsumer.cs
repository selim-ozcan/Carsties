using AuctionService.Data;
using AuctionService.Entities;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;

namespace AuctionService;

public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    private readonly AuctionDbContext _auctionDbContext;

    public AuctionFinishedConsumer(AuctionDbContext auctionDbContext)
    {
        _auctionDbContext = auctionDbContext;
    }
    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        var auction = await _auctionDbContext.Auctions.FindAsync(Guid.Parse(context.Message.AuctionId));

        if (auction != null) 
        {
            if (context.Message.ItemSold)
            {
                auction.SoldAmount = context.Message.Amount;
                auction.Winner = context.Message.Winner;
            }

            auction.Status = auction.SoldAmount > auction.ReservePrice 
                ? Status.Finished
                : Status.ReserveNotMet;

            await _auctionDbContext.SaveChangesAsync();
        }
    }
}
