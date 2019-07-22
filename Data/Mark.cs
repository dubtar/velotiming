using System;
namespace VeloTiming.Data
{
    public class Mark
    {
        public string Id { get; set; }
        public DateTime? Time { get; set; }
        public string TimeSource { get; set; }
        public string Number { get; set; }
        public string NumberSource { get; set; }
        public bool IsIgnored { get; set; }
    }
}