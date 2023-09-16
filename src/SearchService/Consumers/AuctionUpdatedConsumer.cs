using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace SearchService;

public class AuctionUpdatedConsumer : IConsumer<AuctionUpdated>
{
    private readonly IMapper _mapper;

    public AuctionUpdatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        var item = _mapper.Map<Item>(context.Message);

        await DB.Update<Item>()
            .MatchID(item.ID)
            .ModifyOnly(i => new {i.Color, i.Mileage, i.Make, i.Model, i.Year}, item)
            .ExecuteAsync();
    }
}
