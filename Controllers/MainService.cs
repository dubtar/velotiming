using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using VeloTiming.Data;
using VeloTiming.Hubs;

namespace VeloTiming
{

    public interface IMainService
    {
        RaceInfo StartRace(int startId);
        RaceInfo GetRaceInfo();
        IEnumerable<Mark> GetMarks();
        Mark AddMark(Mark mark);
        Mark UpdateMark(Mark mark);
        Task SetActiveStart(Start start);
    }

    public class MainService : IMainService
    {
        private static RaceInfo Race;
        private static List<Mark> Marks;
        public MainService()
        {
        }
        public RaceInfo GetRaceInfo()
        {
            return Race;
        }
        public static void Init(IServiceProvider serviceProvider)
        {
            using (var serviceScope = serviceProvider.CreateScope())
            {
                var services = serviceScope.ServiceProvider;

                try
                {
                    var dataContext = services.GetRequiredService<DataContext>();

                    var activeStart = dataContext.Starts.Include(s => s.Race).FirstOrDefault(s => s.IsActive);
                    if (activeStart != null)
                    {
                        Race = new RaceInfo(activeStart);
                    }
                    // TODO: Load Marks
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine(ex.ToString());
                }
            }
        }

        public async Task SetActiveStart(Start start)
        {
            Race = start == null ? null : new RaceInfo(start);
            await GetHub().Clients.All.ActiveStart(Race);
        }

        public IEnumerable<Mark> GetMarks()
        {
            IEnumerable<Mark> result =  Marks?.AsReadOnly();
            if (result == null) result = new Mark[0];
            return result;
        }

        public Mark AddMark(Mark mark)
        {
            if (string.IsNullOrEmpty(mark.Id)) mark.Id = Guid.NewGuid().ToString();
            Marks.Add(mark);
            return mark;
        }

        public Mark UpdateMark(Mark mark)
        {
            var ind = Marks.FindIndex(m => m.Id == mark.Id);
            if (ind < 0) throw new Exception($"Mark not found with id: {mark.Id}");
            Marks[ind] = mark;
            return mark;
        }

        public RaceInfo StartRace(int startId)
        {
            throw new NotImplementedException();
        }

        private IHubContext<ResultHub, IResultHub> GetHub() {
            return Startup.GetRequiredService<IHubContext<ResultHub, IResultHub>>();
        }
    }

    public class RaceInfo
    {
        public RaceInfo(Start start)
        {
            StartId = start.Id;
            RaceName = start.Race.Name;
            StartName = start.Name;
            Start = start.RealStart;
        }

        public int StartId { get; set; }
        public string RaceName { get; set; }
        public string StartName { get; set; }
        public DateTime? Start { get; set; }
    }
}