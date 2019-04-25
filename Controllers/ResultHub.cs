using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using VeloTiming.Data;
using VeloTiming.Services;

namespace VeloTiming.Hubs {
    public class ResultHub : Hub
    {
        public readonly IMainService raceService ;
        public ResultHub(IMainService raceService)
        {
            this.raceService = raceService;
        }
        public async Task RaceStarted() {
            var race = raceService.StartRace();
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