using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using VeloTiming.Data;

namespace VeloTiming.Controllers
{
    [Route("api")]
    public class MainController : Controller
    {
        public static Race StartedRace; 
        public static RaceStart CurrentStart;

        private readonly IRaceService raceService;
        private readonly DataContext dataContext;

        public MainController(IRaceService raceService, DataContext dataContext)
        {
            this.raceService = raceService;
            this.dataContext = dataContext;
        }

        [HttpPost("start")]
        public async IActionResult Start(int raceId)
        {
            if (StartedRace != null && StartedRace.Id != )
            var race = this.dataContext.Races.FindAsync(raceId);
            if (race == null) return NotFound($"Race not found by id: {raceId}");

            return Ok();
        }

        [HttpGet("race")]
        public RaceInfo GetCurrentRace()
        {
            return raceService.GetRaceInfo();
        }

        [HttpGet("marks")]
        public IEnumerable<Mark> GetMarks()
        {

            return raceService.GetMarks();
        }
    }
}