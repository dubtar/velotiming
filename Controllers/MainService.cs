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
        void StartRun();
        RaceInfo GetRaceInfo();
        IEnumerable<Mark> GetMarks();
        void AddMark(Mark mark);
        void UpdateMark(Mark mark);
        Task SetActiveStart(Start start);
    }

    public class MainService : IMainService
    {
        private static RaceInfo Race;
        private readonly static List<Mark> Results = new List<Mark>();
        private readonly IHubContext<ResultHub, IResultHub> hub;
        private readonly IBackgroundTaskQueue taskQueue;

        public MainService(IHubContext<ResultHub, IResultHub> hub, IBackgroundTaskQueue taskQueue)
        {
            this.hub = hub;
            this.taskQueue = taskQueue;
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
            await hub.Clients.All.ActiveStart(Race);
        }

        public IEnumerable<Mark> GetMarks()
        {
            IEnumerable<Mark> result = Results?.AsReadOnly();
            if (result == null) result = new Mark[0];
            return result;
        }

        public void AddMark(Mark mark)
        {
            taskQueue.QueueBackgroundWorkItem( (token) =>
                ProcessAddMark(mark, token)
            );
        }

        public void UpdateMark(Mark mark)
        {
            taskQueue.QueueBackgroundWorkItem( (token) =>
                ProcessUpdateMark(mark, token)
            );
        }

        public void StartRun()
        {
            if (Race.Start == null)
            {
                Race.Start = DateTime.Now;
                lock(Results)
                    Results.Clear();
                hub.Clients.All.RaceStarted(Race);
            }
        }

        #region Process inputs methods. Main logic is here
        const int MARKS_MERGE_SECONDS = 10;
        private  Task ProcessAddMark(Mark mark, System.Threading.CancellationToken token)
        {
            var result = Task.CompletedTask;
            if (string.IsNullOrEmpty(mark.Id)) mark.Id = Guid.NewGuid().ToString();
            DateTime markTime = mark.Time ?? DateTime.Now;
            lock (Results)
            {
                var leftTime = markTime.AddSeconds(-MARKS_MERGE_SECONDS);
                var rightTime = markTime.AddSeconds(MARKS_MERGE_SECONDS);
                var nearbyMarks = Results.Where(m => m.Time >= leftTime && m.Time <= rightTime);
                // determine type of a mark:
                // if only time with empty number - then search for number without time and set, or add new time
                // if number without time - then search for time without number and set. Or 
                foreach (var m in nearbyMarks)
                {
                    if (token.IsCancellationRequested) break;
                }
            }
        }
        private Task ProcessUpdateMark(Mark mark, System.Threading.CancellationToken token)
        {
            var restul = Task.CompletedTask;
            lock(Results)

            return Task.CompletedTask;
        }
    }
    #endregion
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