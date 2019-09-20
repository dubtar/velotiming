using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace VeloTiming.Data
{
    public class Mark
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public DateTime? Time { get; set; }
        public string TimeSource { get; set; }
        public string Number { get; set; }
        public string NumberSource { get; set; }
        public bool IsIgnored { get; set; }
        public IList<MarkData> Data { get; set; } = new List<MarkData>();
        public DateTime CreatedOn { get; private set; } = DateTime.Now;
    }
    public class MarkData 
    {
        public DateTime? Time { get; set; }
        public string Number { get; set; }
        public string Source { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}