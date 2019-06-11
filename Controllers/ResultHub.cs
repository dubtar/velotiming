using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using VeloTiming.Data;
using VeloTiming.Services;

namespace VeloTiming.Hubs
{
    public interface IResultHub
    {
        Task ActiveStart(RaceInfo race);
        Task RaceStarted(RaceInfo race);
        Task ResultAdded(Mark mark);
        Task ResultUpdated(Mark mark);

    }
    public class ResultHub : Hub<IResultHub>
    {
        public readonly IMainService raceService;
        public ResultHub(IMainService raceService)
        {
            this.raceService = raceService;
        }
        public void ResultAdded(Mark mark)
        {
            raceService.AddMark(mark);
        }

        public void ResultUpdated(Mark mark)
        {
            raceService.UpdateMark(mark);
        }
    }
}