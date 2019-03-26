using System;

namespace VeloTiming
{

    public interface IRaceService
    {
        DateTime? GetRaceStart();
        DateTime StartRace();
        RaceInfo GetRaceInfo();
    }

    public class RaceService : IRaceService
    {
        // TODO: store this in db
        private static DateTime? RaceStart;
        private static RaceInfo Race;

        public RaceInfo GetRaceInfo()
        {
            if (Race == null) Race = new RaceInfo {
                Name = "Пробная гонка",
                Date = DateTime.Now.Date
            };
            return Race;
        }

        public DateTime? GetRaceStart()
        {
            return RaceStart;
        }

        public DateTime StartRace()
        {
            if (RaceStart == null)
                RaceStart = DateTime.Now;
            return RaceStart.Value;
        }
    }

    public class RaceInfo {
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public DateTime Start { get; set; }
    }
}