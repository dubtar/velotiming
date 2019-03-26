using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace VeloTiming.Hubs {
    public class ResultHub : Hub
    {
        public readonly IRaceService raceService ;
        public ResultHub(IRaceService raceService)
        {
            this.raceService = raceService;
        }

        public async Task GetRaceInfo() {
            var info = raceService.GetRaceInfo();
            await Clients.All.SendAsync("GetRaceInfo", info);
        }

        public async Task RaceStarted() {
            var startDate = raceService.StartRace();
            await Clients.All.SendAsync("Start", startDate);
        }

        public async Task ResultAdded(Mark mark) {
            await Clients.Others.SendAsync("ResultAdded", mark);
        }
    }
}