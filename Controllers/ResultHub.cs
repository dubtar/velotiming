using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using VeloTiming.Data;
using VeloTiming.Services;

namespace VeloTiming.Hubs {
    public interface IResultHub
    {
        Task ActiveStart(RaceInfo race);
        Task RaceStarted(RaceInfo race);
        Task ResultAdded(Mark mark);
        Task ResultUpdated(Mark mark);
        
    }
    public class ResultHub : Hub<IResultHub>
    {
        public readonly IMainService raceService ;
        public ResultHub(IMainService raceService)
        {
            this.raceService = raceService;
        }
        public async Task RaceStarted(int startId) {
            var race = raceService.StartRace(startId);
            await Clients.All.RaceStarted(race);
        }

        public async Task ResultAdded(Mark mark) {
            mark = raceService.AddMark(mark);
            await Clients.Others.ResultAdded(mark);
        }

        public async Task ResultUpdated(Mark mark) {
            mark = raceService.UpdateMark(mark);
            await Clients.Others.ResultUpdated(mark);
        }
    }
}