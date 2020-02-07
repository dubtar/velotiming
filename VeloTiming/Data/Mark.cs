using System;
using System.Collections.Generic;
using VeloTiming.Controllers;

namespace VeloTiming.Data
{
    public class Mark
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public DateTime? Time { get; set; }
        public string TimeSource { get; set; }
        public string Name { get; set; }
        public string Number { get; set; }
        public string NumberSource { get; set; }
        public bool IsIgnored { get; set; }
        public IList<MarkData> Data { get; set; } = new List<MarkData>();
        public DateTime CreatedOn { get; private set; }
        public int Lap { get; set; }
        public int Place { get; set; }

        internal static Mark Create(ITimeService timeService)
        {
            return new Mark { CreatedOn = timeService.Now };
        }
    }
    public class MarkData
    {
        public DateTime? Time { get; set; }
        public string Number { get; set; }
        public string Source { get; set; }
        public DateTime CreatedOn { get; set; }

        public override bool Equals(object obj)
        {
            if (obj != null && obj is MarkData b)
            {
                return Time == b.Time && Number == b.Number && Source == b.Source && b.CreatedOn == CreatedOn;
            }
            return false;
        }
        public override int GetHashCode()
        {
            return (Time, Number, Source, CreatedOn).GetHashCode();
        }

        internal MarkData Copy()
        {
            return new MarkData { Time = Time, Number = Number, Source = Source, CreatedOn = CreatedOn };
        }
    }
}