using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace SearchService;

public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        var auction = await DB.Find<Item>().OneAsync(context.Message.AuctionId);

        if (auction != null) 
        {
            if (context.Message.ItemSold)
            {
                auction.SoldAmount = (int) context.Message.Amount;
                auction.Winner = context.Message.Winner;
            }

            auction.Status = "Finished";

            await auction.SaveAsync();
        }
    }
}
