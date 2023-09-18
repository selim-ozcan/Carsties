using AuctionService.Data;
using Contracts;
using MassTransit;

namespace AuctionService;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    private readonly AuctionDbContext _auctionDbContext;

    public BidPlacedConsumer(AuctionDbContext auctionDbContext)
    {
        _auctionDbContext = auctionDbContext;
    }
    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        var auction = await _auctionDbContext.Auctions.FindAsync(context.Message.AuctionId);

        if (auction.CurrentHighBid == null 
            || context.Message.BidStatus.Contains("Accepted")
            && auction.CurrentHighBid < context.Message.Amount)
        {
            auction.CurrentHighBid = context.Message.Amount;

            await _auctionDbContext.SaveChangesAsync();
        }
    }
}
