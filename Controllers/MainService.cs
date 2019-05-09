using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using VeloTiming.Data;

namespace VeloTiming
{

    public interface IMainService
    {
        RaceInfo StartRace(int startId);
        RaceInfo GetRaceInfo();
        IEnumerable<Mark> GetMarks();
        Mark AddMark(Mark mark);
        Mark UpdateMark(Mark mark);
        Task SetActiveStart(int startId);
    }

    public class MainService : IMainService
    {
        private static RaceInfo Race;
        private static List<Mark> Marks;
        private readonly DataContext dataContext;
        public MainService(DataContext dataContext)
        {
            this.dataContext = dataContext;
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

        public async Task SetActiveStart(int startId)
        {
            if (Race == null || Race.StartId != startId)
            {
                if (Race != null)
                {
                    // clear old start
                    var activeStart = dataContext.Starts.Include(s => s.Race).FirstOrDefault(s => s.IsActive);
                    activeStart.IsActive = false;
                    activeStart.End = DateTime.Now;
                }

                var start = dataContext.Starts.Include(s => s.Race).FirstOrDefault(s => s.Id == startId);
                start.IsActive = true;

                Race = new RaceInfo(start)
                await dataContext.SaveChangesAsync();
            }
        }

        public IEnumerable<Mark> GetMarks()
        {
            return Marks.AsReadOnly();
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

    }

    public class RaceInfo
    {
        public RaceInfo(Start start)
        {
            StartId = start.Id;
            Racename = start.Race.Name;
            StartName = start.Name;
            Start = start.RealStart;
        }

        public int StartId { get; set; }
        public string Racename { get; set; }
        public string StartName { get; set; }
        public DateTime? Start { get; set; }
    }
}