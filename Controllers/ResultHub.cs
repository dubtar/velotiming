using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace VeloTiming.Hubs {
    public class ResultHub : Hub
    {
        public async Task ResultAdded(Mark mark) {
            await Clients.Others.SendAsync("ResultAdded", mark);
        }
    }
}