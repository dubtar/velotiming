using System;
using System.Collections.Generic;
using VeloTiming.Data;

namespace VeloTiming.Services
{

    public interface IMainService
    {
        RaceInfo StartRace();
        RaceInfo GetRaceInfo();
        IEnumerable<Mark> GetMarks();
        Mark AddMark(Mark mark);
        Mark UpdateMark(Mark mark);
    }

    public class MainService : IMainService
    {
        // TODO: store this in db
        private static RaceInfo Race;
        private static List<Mark> Marks = new List<Mark>();

        public RaceInfo GetRaceInfo()
        {
            if (Race == null) Race = new RaceInfo
            {
                Name = "Пробная гонка",
                Date = DateTime.Now.Date
            };
            return Race;
        }

        public RaceInfo StartRace()
        {
            var race = GetRaceInfo();
            if (race.Start == null)
                race.Start = DateTime.Now;
            return race;
        }

        public IEnumerable<Mark> GetMarks() {
            return Marks;
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
    }

    public class RaceInfo
    {
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public DateTime? Start { get; set; }
    }
}