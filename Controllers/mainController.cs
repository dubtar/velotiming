using System;
using Microsoft.AspNetCore.Mvc;

namespace VeloTiming.Controllers
{
    [Route("api")]
    public class MainController : Controller
    {
        private readonly IRaceService raceService;
        public MainController(IRaceService raceService)
        {
            this.raceService = raceService;
        }
        private static DateTime? startTime;

        [HttpGet]
        public RaceInfo GetCurrentRace()
        {
            return raceService.GetRaceInfo();
        }

        [HttpGet]
        public string Get()
        {
            return "TEst";
        }
    }
}