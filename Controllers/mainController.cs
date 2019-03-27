using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using VeloTiming.Data;

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