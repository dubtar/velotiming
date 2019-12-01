using System;

namespace VeloTiming.Controllers
{
    public interface ITimeService
    {
        DateTime Now { get; }

    }

    public class TimeService : ITimeService
    {
        public DateTime Now => DateTime.Now;
    }
}