using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using VeloTiming.Data;

namespace VeloTiming.Hubs {
    public class ResultHub : Hub
    {
        public readonly IMainService raceService ;
        public ResultHub(IMainService raceService)
        {
            this.raceService = raceService;
        }
        public async Task RaceStarted(int startId) {
            var race = raceService.StartRace(startId);
            await Clients.All.SendAsync("RaceStarted", race);
        }

        public async Task ResultAdded(Mark mark) {
            mark = raceService.AddMark(mark);
            await Clients.Others.SendAsync("ResultAdded", mark);
        }

        public async Task ResultUpdated(Mark mark) {
            mark = raceService.UpdateMark(mark);
            await Clients.Others.SendAsync("ResultUpdated", mark);
        }
    }
}