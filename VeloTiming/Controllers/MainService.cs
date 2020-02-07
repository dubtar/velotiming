using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using VeloTiming.Data;
using VeloTiming.Hubs;

namespace VeloTiming.Controllers
{

    public interface IMainService
    {
        void StartRun(DateTime realStart);
        RaceInfo GetRaceInfo();
        IEnumerable<Mark> GetMarks();
        void AddTime(DateTime time, string source);
        void AddNumber(string number, string source);
        void UpdateMark(Mark mark);
        Task SetActiveStart(Start start, Dictionary<string, string> numbers);
        void AddNumberAndTime(string id, DateTime time, string v);
    }

    public class MainService : IMainService
    {
        private RaceInfo Race;
        private readonly List<Mark> Results = new List<Mark>();
        private readonly IServiceProvider serviceProvider;
        private readonly IHubContext<ResultHub, IResultHub> hub;
        private readonly IBackgroundTaskQueue taskQueue;
        private readonly ITimeService timeService;

        public MainService(IServiceProvider serviceProvider)
        //, , IResultHub> hub, IBackgroundTaskQueue taskQueue)
        {
            this.serviceProvider = serviceProvider;
            this.hub = serviceProvider.GetService<IHubContext<ResultHub, IResultHub>>();
            this.taskQueue = serviceProvider.GetService<IBackgroundTaskQueue>();
            this.timeService = serviceProvider.GetService<ITimeService>();
            _ = Init();
        }

        public RaceInfo GetRaceInfo()
        {
            return Race;
        }
        private async Task Init()
        {
            using (var serviceScope = serviceProvider.CreateScope())
            {
                var services = serviceScope.ServiceProvider;

                try
                {
                    using (var dataContext = services.GetRequiredService<DataContext>())
                    {

                        var activeStart = await dataContext.Starts.Include(s => s.Race).FirstOrDefaultAsync(s => s.IsActive);
                        if (activeStart != null)
                        {
                            var riders = await BuildNumbersDictionary(dataContext, activeStart.Id);
                            Race = new RaceInfo(activeStart, riders);
                            // Load Marks
                            Results.Clear();
                            Results.AddRange(dataContext.Results);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine(ex.ToString());
                }
            }
        }

        public static async Task<Dictionary<string, string>> BuildNumbersDictionary(DataContext dataContext, int startId)
        {
            var categoryIds = await dataContext.Set<StartCategory>().Where(s => s.Start.Id == startId).Select(s => s.Category.Id).ToArrayAsync();
            var riders = await dataContext.Set<Rider>().Where(r => categoryIds.Contains(r.Category.Id)).ToDictionaryAsync(r => r.Number.Id, r => $"{r.LastName} {r.FirstName}");
            return riders;
        }
        public async Task SetActiveStart(Start start, Dictionary<string, string> numbers)
        {
            Race = start == null ? null : new RaceInfo(start, numbers);
            await hub.Clients.All.ActiveStart(Race);
        }

        public IEnumerable<Mark> GetMarks()
        {
            IEnumerable<Mark> result = Results?.AsReadOnly();
            if (result == null) result = new Mark[0];
            return result;
        }

        public void AddTime(DateTime time, string source)
        {
            time = time.ToLocalTime();
            taskQueue.QueueBackgroundWorkItem((token) =>
               ProcessAddMark(time, null, source, token)
            );
        }

        public void AddNumber(string number, string source)
        {
            taskQueue.QueueBackgroundWorkItem((token) =>
               ProcessAddMark(null, number, source, token)
            );
        }

        public void AddNumberAndTime(string number, DateTime time, string source)
        {
            taskQueue.QueueBackgroundWorkItem((token) =>
                ProcessAddMark(time, number, source, token)
            );
        }

        public void UpdateMark(Mark mark)
        {
            taskQueue.QueueBackgroundWorkItem((token) =>
               ProcessUpdateMark(mark, token)
            );
        }

        public void StartRun(DateTime date)
        {
            if (Race.Start == null)
            {
                Race.Start = date;
                lock (Results)
                    Results.Clear();
                Task task = SendRaceStarted();
            }
        }
        #region send signalr messages to clients
        private async Task SendRaceStarted()
        {
            await hub.Clients.All.RaceStarted(Race);
        }

        private async Task SendResultAdded(Mark mark)
        {
            await hub.Clients.All.ResultAdded(mark);
        }

        private async Task SendResultUpdated(Mark mark)
        {
            await hub.Clients.All.ResultUpdated(mark);
        }
        #endregion

        #region Process inputs methods. Main logic is here
        const int MARKS_MERGE_SECONDS = 30;
        private Task ProcessAddMark(DateTime? time, string number, string source, System.Threading.CancellationToken token)
        {
            DateTime markTime = time ?? timeService.Now;
            Task task = null;
            lock (Results)
            {
                var leftTime = markTime.AddSeconds(-MARKS_MERGE_SECONDS);
                var rightTime = markTime.AddSeconds(5);
                var nearbyResults = Results.SkipWhile(m => (m.Time ?? m.CreatedOn) < leftTime).TakeWhile(m => (m.Time ?? m.CreatedOn) <= rightTime);
                bool reorder = false;
                bool added = false;
                Mark result = null;
                // determine type of a mark:
                if (time.HasValue && string.IsNullOrWhiteSpace(number))
                {
                    // if only time with empty number 
                    // then search for number without time and set, or add new time
                    result = nearbyResults.FirstOrDefault(r => !r.Time.HasValue);
                    if (result == null)
                    {
                        Results.Add(result = Mark.Create(timeService)); // add new time withough
                        added = true;
                    }
                    result.Time = time;
                    result.TimeSource = source;
                    reorder = true;
                }
                else if (!time.HasValue && !string.IsNullOrWhiteSpace(number))
                {
                    // if number without time - then search for time without number and set. Or 
                    result = nearbyResults.FirstOrDefault(r => string.IsNullOrWhiteSpace(r.Number));
                    if (result == null)
                    {
                        Results.Add(result = Mark.Create(timeService));
                        reorder = added = true;
                    }
                    result.Number = number;
                    result.NumberSource = source;
                }
                else if (time.HasValue && !string.IsNullOrWhiteSpace(number))
                {
                    // if have both time and number - search if number already exists 
                    result = nearbyResults.FirstOrDefault(r => r.Number == number);
                    if (result == null)
                    {
                        result = Mark.Create(timeService);
                        result.Number = number;
                        result.NumberSource = source;
                        Results.Add(result);
                        reorder = added = true;
                    }
                    // TODO: update time based on source priority
                    result.Time = time;
                    result.TimeSource = source;
                }

                if (result != null)
                {
                    if (string.IsNullOrWhiteSpace(result.Number) || !Race.Numbers.TryGetValue(result.Number, out var rider))
                        result.Name = null;
                    else
                        result.Name = rider;
                    result.Data.Add(new MarkData
                    {
                        CreatedOn = timeService.Now,
                        Number = number,
                        Source = source,
                        Time = time
                    });
                    if (reorder)
                        Results.Sort(delegate (Mark a, Mark b)
                        {
                            return (a.Time ?? a.CreatedOn).CompareTo(b.Time ?? b.CreatedOn);
                        });
                    ProcessPlace(result);

                    if (added)
                        task = SendResultAdded(result);
                    else
                        task = SendResultUpdated(result);
                    task = Task.WhenAll(task, StoreResult(result));
                }
            }
            return task ?? Task.CompletedTask;
        }

        private void ProcessPlace(Mark result, int? index = null)
        {
            if (index == null) index = Results.IndexOf(result);
            if (index == null || index < 0) return;
            if (string.IsNullOrEmpty(result.Number))
            {
                result.Lap = -1;
                result.Place = -1;
                return;
            }
            int lap = 0;
            List<int> places = new List<int>();
            for (int i = 0; i < index; i++)
            {
                var res = Results[i];
                if (res.IsIgnored || string.IsNullOrEmpty(result.Number)) continue;
                int curLap;
                if (res.Number == result.Number)
                    curLap = lap++;
                else
                    curLap = res.Lap - 1;
                if (places.Count <= curLap)
                    places.Add(1);
                else
                    places[curLap]++;

            }
            result.Lap = lap + 1;
            result.Place = places.Count > lap ? places[lap] + 1 : 1;
            // recalculate all results after that
            for (int i = index.Value + 1; i < Results.Count; i++)
                ProcessPlace(Results[i], i);
        }

        private async Task StoreResult(Mark result)
        {
            if (result == null || Race == null) return;
            var scopeFactory = serviceProvider.GetService<IServiceScopeFactory>();
            using (var scope = scopeFactory.CreateScope())
            {
                var resultService = scope.ServiceProvider.GetService<IResultRepository>();
                await resultService.AddOrUpdateResult(result);
            }
        }

        private Task ProcessUpdateMark(Mark mark, System.Threading.CancellationToken token)
        {
            var result = Task.CompletedTask;
            lock (Results)
            {
            }
            return Task.CompletedTask;
        }
    }
    #endregion
}

public class RaceInfo
{
    public RaceInfo(Start start, Dictionary<string, string> numbers)
    {
        StartId = start.Id;
        RaceName = start.Race.Name;
        StartName = start.Name;
        Start = start.RealStart;
        Numbers = new ReadOnlyDictionary<string, string>(numbers);
    }

    public int StartId { get; set; }
    public string RaceName { get; set; }
    public string StartName { get; set; }
    public DateTime? Start { get; set; }
    public ReadOnlyDictionary<string, string> Numbers { get; private set; }
}