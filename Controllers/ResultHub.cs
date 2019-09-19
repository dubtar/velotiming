using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using VeloTiming.Data;

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

        // Methods
        public void AddTime(DateTime time, string source)
        {
            raceService.AddTime(time, source);
        }

        public void AddNumber(string number, string source)
        {
            raceService.AddNumber(number, source);
        }
    }
}