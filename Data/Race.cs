using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace VeloTiming.Data
{

    public class Race
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public RaceType Type { get; set; }
        public ICollection<Entry> Entries { get; set; }
        public ICollection<RaceCategory> Categories { get; set; }

    }

    public enum RaceType {
        [Description("Групповая кругами")]
        Laps = 1,
        [Description("Разделка")]
        TimeTrial = 2
        // Criterium
    }
}